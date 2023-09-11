import boto3
import botocore
from flask import jsonify
import os


my_key = os.environ['access_key']
my_secret = os.environ['secret_key']
my_bucket = os.environ['bucket_id']


def upload_to_bucket(file_path, object_name, endpoint_url):
    s3 = boto3.client(
        's3',
        aws_access_key_id=my_key,
        aws_secret_access_key=my_secret,
        endpoint_url=endpoint_url
    )
    
    try:
        s3.upload_file(file_path, my_bucket, object_name)
        print(f"Successfully uploaded {object_name} to {my_bucket}")
        return jsonify(
            {"message": f"Successfully uploaded {object_name} to {my_bucket} "})
    except botocore.exceptions.ClientError as e:
        return jsonify({"message": "Error uploading file: " + e })

def delete_from_bucket(object_name, endpoint_url):
    s3 = boto3.client(
        's3',
        aws_access_key_id=my_key,
        aws_secret_access_key=my_secret,
        endpoint_url=endpoint_url
    )
    
    try:
        s3.delete_object(Bucket=my_bucket, Key=object_name)
        print(f"Successfully deleted {object_name} from {my_bucket}")
        return jsonify({"message": f"Successfully deleted {object_name} from {my_bucket}"})
    except botocore.exceptions.ClientError as e:
        return jsonify({"message": "Error deleting file: " + e })

def list_bucket_contents(endpoint_url):
    s3 = boto3.client(
        's3',
        aws_access_key_id=my_key,
        aws_secret_access_key=my_secret,
        endpoint_url=endpoint_url
    )
    
    try:
        ret = []
        file_sizes = []
        counter = 0
        response = s3.list_objects_v2(Bucket=my_bucket)
        if 'Contents' in response:
            print(f"Contents of {my_bucket}:")
            for obj in response['Contents']:
              #append key to list
              ret.append(obj['Key'])

              obj_metadata = s3.head_object(Bucket=my_bucket, Key=ret[counter])
              file_sizes.append(obj_metadata['ContentLength'])
              counter+=1

            print(ret,file_sizes)
            return jsonify({"message":ret,"file_sizes":file_sizes})
        else:
            return jsonify({"message": f"{my_bucket} is empty","file_sizes":["test"] })
    except botocore.exceptions.ClientError as e:
        return jsonify({"message": "Error listing bucket contents: " + e })

def download_from_bucket(object_name, endpoint_url):
    s3 = boto3.client(
        's3',
        aws_access_key_id=my_key,
        aws_secret_access_key=my_secret,
        endpoint_url=endpoint_url
    )
    
    try:
        s3.download_file(my_bucket, object_name, object_name)
        print(f"Successfully downloaded {object_name} from {my_bucket}")
        return object_name
      
    except botocore.exceptions.ClientError as e:
        return jsonify({"message": "Error downloading file: " + str(e) })
