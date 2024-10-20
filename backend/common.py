import json
import boto3
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

def saveToS3(file_name, response, type1):
    s3_bucket_name = 'audiofiles1234'
    region_name = 'us-west-2' 
    
    s3_client = session.client('s3', region_name)
    s3_client.put_object(Bucket=s3_bucket_name, Key=file_name, Body=response.content)
    main("s3://audiofiles1234/" + file_name, file_name, type1)
