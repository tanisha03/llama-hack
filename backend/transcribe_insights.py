import re
import requests
import boto3
import time
import json
from requests.auth import HTTPBasicAuth
from datetime import datetime
import re
from dotenv import load_dotenv
import os

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY_ID = os.getenv('AWS_SECRET_KEY_ID')

region_name = 'us-west-2' 
session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_KEY_ID,
    region_name=region_name
)

s3_bucket_name = 'audiofiles1234'

s3_client = session.client('s3')
transcribe_client = session.client('transcribe', region_name=region_name)

def fetch_recording(recording_sid):
    url = f'https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Recordings/{recording_sid}.json'
    response = requests.get(url, auth=HTTPBasicAuth(ACCOUNT_SID, AUTH_TOKEN))
    recording_data = response.json()
    recording_uri = recording_data['uri']
    recording_url = f'https://api.twilio.com{recording_uri}.wav'
    recording_response = requests.get(recording_url, auth=HTTPBasicAuth(ACCOUNT_SID, AUTH_TOKEN))
    return recording_response
    
def upload_to_s3(recording_sid, recording_response):
    s3_file_name = f'recording_{recording_sid}.wav'
    s3_client.put_object(Bucket=s3_bucket_name, Key=s3_file_name, Body=recording_response.content)

def trigger_transcribe_job(s3_uri, transcribe_job_name):
    transcribe_client.start_transcription_job(
        TranscriptionJobName=transcribe_job_name,  # Change as needed
        Media={'MediaFileUri': s3_uri},
        MediaFormat='mp3',
        LanguageCode='hi-IN',
        OutputBucketName=s3_bucket_name,
        OutputKey=f'transcription_{transcribe_job_name}.json'
    )


def generate_presigned_url(bucket_name, object_key):
    response = s3_client.generate_presigned_url('get_object',
        Params={'Bucket': bucket_name, 'Key': object_key},
        ExpiresIn=3600  
    )
    return response

def generate_insights(transcribe_job_name):
    while True:
        job = transcribe_client.get_transcription_job(TranscriptionJobName=transcribe_job_name)
        status = job['TranscriptionJob']['TranscriptionJobStatus']
        
        if status in ['COMPLETED', 'FAILED']:
            break
        time.sleep(11) 

    if status == 'COMPLETED':
        transcription_uri = job['TranscriptionJob']['Transcript']['TranscriptFileUri']
        presigned_url = generate_presigned_url(s3_bucket_name, transcribe_job_name + ".json")
        transcription_response = requests.get(presigned_url)
        transcription_data = transcription_response.json()
        res = process_transcription(transcription_data)
        return res
    else:
        print("Transcription job failed.")

def invoke_bedrock_model(transcription_text):
    prompt = (
        "Please summarize the following conversation transcript in 50-60 words. Also, generate top 3 related tags for the conversation." +
        f"Conversation: {transcription_text}\n"
    )
    bedrock_client = session.client('bedrock-runtime', region_name="us-west-2")
    response = bedrock_client.invoke_model(
        modelId='meta.llama3-1-405b-instruct-v1:0',  
        body=json.dumps({
            "prompt": prompt
        })
    )
    return response

def process_transcription(transcription_data):

    try:
        transcription_text = transcription_data.get('results')['transcripts'][0]['transcript']
    except IndexError as e:
        return {"summary": "No transcription available", "tags": []}
    bedrock_response = invoke_bedrock_model(transcription_text)
    bedrock_output = bedrock_response['body'].read()  
    bedrock_result = json.loads(bedrock_output)  
    
    gen = bedrock_result.get('generation')
    parts = gen.split("\n\nTop 3 related tags")

    summary = parts[0].replace("Summary:\n", "").strip()  

    separator = "Top 3 related tags:"

    if separator in gen:
        tags_string = gen.split(separator)[1].strip() 
        tags_list = [tag.strip() for tag in tags_string.split(',')]  
    else:
        tags_list = []

    output_dict = {
        "summary": summary,
        "tags": tags_list
    }
    return output_dict

def create_transcribe_job(s3_uri, job_name):
    transcribe = session.client('transcribe')

    response = transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        LanguageCode='hi-IN',
        Media={'MediaFileUri': s3_uri},
        MediaFormat='mp3',  
        Settings={
            'ShowSpeakerLabels': True,
            'MaxSpeakerLabels': 2,  
            'ChannelIdentification': True
        },
        OutputBucketName=s3_bucket_name
    )

    return response

def save(new_structure, file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)

    data['data'].append(new_structure)

    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)
    pass

def main(s3_url, job_name, type1):
    create_transcribe_job(s3_url, job_name)
    ans = generate_insights(job_name)
    now = datetime.now()
    current_date = now.strftime("%Y-%m-%d")
    current_time = now.strftime("%H:%M:%S")
    updated_string = s3_url.replace("s3://audiofiles1234", "https://audiofiles1234.s3.us-west-2.amazonaws.com")

    if(type1 == "regular"):
        new_structure = {
            "callType": "Support Call",
            "date": current_date,
            "time": current_time,
            "mp3File": updated_string,
            "transcribeJobName": job_name,
            "summary": ans['summary'],
            "tags": ans['tags']
        }
        save(new_structure,'/Users/raghavmaheshwari/speech-assistant-realtime-api-python/regular.json')
    else:
        new_structure = {
            "callType": "Survey Call",
            "date": current_date,
            "time": current_time,
            "mp3File": updated_string,
            "transcribeJobName": job_name,
            "summary": ans['summary'],
            "tags": ans['tags']
        }
        save(new_structure,'/Users/raghavmaheshwari/speech-assistant-realtime-api-python/survey.json')
