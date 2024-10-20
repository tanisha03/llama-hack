import os
import json
import requests
from fastapi.responses import JSONResponse
from fastapi import FastAPI, WebSocket, Request, Query
from fastapi.responses import HTMLResponse
from fastapi.websockets import WebSocketDisconnect
from twilio.twiml.voice_response import VoiceResponse, Connect, Say, Stream
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from twilio.rest import Client
from fastapi.middleware.cors import CORSMiddleware
import time
import httpx
import base64

from insight_generation import main

load_dotenv()

TWILIO_SECRET_KEY = os.getenv('TWILIO_SECRET_KEY')
TWILIO_ACCESS_KEY = os.getenv('TWILIO_ACCESS_KEY')
PORT = int(os.getenv('PORT', 5050))
SYSTEM_MESSAGE = (
    "You are a helpful and bubbly AI assistant who loves to chat about "
    "anything the user is interested in and is prepared to offer them facts. "
    "Always stay positive, but work in a joke when appropriate. You have to speak in Hindi for any question"
    "asked to you. You might get input also in hindi, make sure that you work accordingly."
)
VOICE = 'alloy'
LOG_EVENT_TYPES = [
    'response.content.done', 'rate_limits.updated', 'response.done',
    'input_audio_buffer.committed', 'input_audio_buffer.speech_stopped',
    'input_audio_buffer.speech_started', 'session.created'
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/", response_class=HTMLResponse)
async def index_page():
    return {"message": "Twilio Media Stream Server is running!"}

@app.api_route("/incoming-call-regular", methods=["GET", "POST"])
async def handle_incoming_call(request: Request):
    """Handle incoming call and return TwiML response to connect to Media Stream."""
    response = VoiceResponse()
    response.say("Please wait while we connect your call to the Bank Mitra", voice='Polly.Aditi')
    response.pause(length=1)
    response.say("Please start talking now.", voice='Polly.Aditi')
    host = request.url.hostname
    connect = Connect()
    connect.stream(url=f'wss://{host}/media-stream')
    response.append(connect)
    return HTMLResponse(content=str(response), media_type="application/xml")

@app.get("/initiate-call")
async def handle_recording(request: Request):

    global SYSTEM_MESSAGE
    SYSTEM_MESSAGE = SYSTEM_MESSAGE  # Use the default value

    try:
        client = Client(TWILIO_ACCESS_KEY, TWILIO_SECRET_KEY)
        call = client.calls.create(
            to="+918384852943",
            from_="+18583751720",
            url='https://0bed-14-143-179-90.ngrok-free.app/incoming-call-regular',  # Replace with your actual server URL
            record=True,
            status_callback='https://0bed-14-143-179-90.ngrok-free.app/recording-complete-regular',  # URL to receive recording info
            status_callback_method='POST' 
        )
        print(f"Call initiated: {call.sid}")
    except Exception as e:
        print(e)

@app.get("/get-regular-call-records")
async def handle_get_call_records():
    with open("regular.json", "r") as file:
        data = json.load(file)
    data1 = data['data']
    data1.reverse()
    return JSONResponse(content={'data': data1})

@app.post("/recording-complete-regular")
async def recording_complete(request: Request):
    form_data = await request.form()
    recording_sid = form_data.get('RecordingSid')
    client = Client(TWILIO_ACCESS_KEY, TWILIO_SECRET_KEY)
    recording = client.recordings(recording_sid).fetch()
    account_sid = recording.account_sid

    time.sleep(30)
    response = requests.get(f'https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Recordings/{recording_sid}.mp3')
    if response.status_code == 200:
        saveToS3(f'{recording_sid}' + ".mp3", response, 'regular')
        return JSONResponse(content={"message": "Recording saved successfully."})
    else:
        return JSONResponse(content={"error": "Failed to download recording.", "status_code": response.status_code}, status_code=response.status_code)



@app.post("/media-stream")
async def handle_media_stream(request: Request):
    """Handle incoming media stream from Twilio using Bedrock API."""
    data = await request.json()
    stream_sid = None
    bedrock_client = session.client('bedrock-runtime', region_name="us-west-2")

    async def send_to_bedrock(audio_data):
        """Send audio data to the Bedrock API and receive responses."""
        try:
            response = bedrock_client.invoke_model(
                modelId='meta.llama3-8b-instruct-v1:0',  # Replace with your actual Bedrock model ID
                body=json.dumps({"input": audio_data})  # Adjust payload as needed
            )
            return json.loads(response['body'].read())
        except Exception as e:
            print(f"Error invoking Bedrock model: {e}")
            return None

    async def process_twilio_media():
        """Process incoming media events from Twilio."""
        nonlocal stream_sid
        if data['event'] == 'media':
            audio_payload = data['media']['payload']
            response = await send_to_bedrock(audio_payload)
            if response.status_code == 200:
                return response.json() 
            else:
                print(f"Error from Bedrock API: {response.status_code}")
                return None
        elif data['event'] == 'start':
            stream_sid = data['start']['streamSid']
            print(f"Incoming stream has started {stream_sid}")

    result = await process_twilio_media()
    if result:
        audio_payload = base64.b64encode(base64.b64decode(result['delta'])).decode('utf-8')
        audio_delta = {
            "event": "media",
            "streamSid": stream_sid,
            "media": {
                "payload": audio_payload
            }
        }
        return JSONResponse(content=audio_delta)

    return JSONResponse(content={"error": "No audio processed."}, status_code=400)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)