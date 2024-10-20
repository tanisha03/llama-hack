from email.mime import audio
import json
import requests
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from twilio.twiml.voice_response import VoiceResponse, Connect, Say, Stream
from fastapi import FastAPI, Request
from twilio.rest import Client
from fastapi.middleware.cors import CORSMiddleware
import time
import os
from dotenv import load_dotenv
import boto3

load_dotenv()

TWILIO_SECRET_KEY = os.getenv('TWILIO_SECRET_KEY')
TWILIO_ACCESS_KEY = os.getenv('TWILIO_ACCESS_KEY')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY_ID = os.getenv('AWS_SECRET_KEY_ID')

app = FastAPI()
region_name = "us-west-2"

session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_KEY_ID,
    region_name=region_name
)

@app.post("/recording-complete-survey")
async def recording_complete(request: Request):
    form_data = await request.form()
    recording_sid = form_data.get('RecordingSid')
    client = Client(TWILIO_ACCESS_KEY, TWILIO_SECRET_KEY)
    recording = client.recordings(recording_sid).fetch()
    account_sid = recording.account_sid

    time.sleep(30)
    response = requests.get(f'https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Recordings/{recording_sid}.mp3')
    if response.status_code == 200:
        saveToS3(f'{recording_sid}' + ".mp3", response, 'survey')
        return JSONResponse(content={"message": "Recording saved successfully."})
    else:
        return JSONResponse(content={"error": "Failed to download recording.", "status_code": response.status_code}, status_code=response.status_code)

@app.api_route("/incoming-call-survey", methods=["GET", "POST"])
async def handle_incoming_call(request: Request):
    """Handle incoming call and return TwiML response to connect to Media Stream."""
    response = VoiceResponse()
    response.say("Thank you for accepting the call." + 
        "We have identified that you might be a good fit for this survey.", voice='Polly.Aditi')
    response.pause(length=1)
    response.say("Say Yes to get started.", voice='Polly.Aditi')
    host = request.url.hostname
    connect = Connect()
    connect.stream(url=f'wss://{host}/media-stream')
    response.append(connect)
    return HTMLResponse(content=str(response), media_type="application/xml")


class SurveyRequest(BaseModel):
    prompt: str

@app.post("/initiate-survey")
async def handle_recording(request: SurveyRequest):
    try:
        client = Client(TWILIO_ACCESS_KEY, TWILIO_SECRET_KEY) 

        user_prompt = request.prompt
        global SYSTEM_MESSAGE
        SYSTEM_MESSAGE = user_prompt

        call = client.calls.create(
            to="+918384852943",
            from_="+18583751720",
            url='https://0bed-14-143-179-90.ngrok-free.app/incoming-call-survey',  
            record=True,
            status_callback='https://0bed-14-143-179-90.ngrok-free.app/recording-complete-survey',  
            status_callback_method='POST' 
        )
        
        print(f"Call initiated: {call.sid}")
        return {"message": "Call initiated", "call_sid": call.sid}
    
    except Exception as e:
        return {"error": str(e)}

@app.get("/get-survey-call-records")
async def handle_get_call_records():
    with open("survey.json", "r") as file:
        data = json.load(file)
    data1 = data['data']
    data1.reverse()
    return JSONResponse(content={'data': data1})