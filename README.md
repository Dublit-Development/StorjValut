# StorjValut

# Personal NAS
This project is a simple file storage API using StorJ to create a personal version of Google Drive.

## Getting Started

### Storj
To get started, you will want to head over to [Storj](https://storj.io) and create an account. Once your account is created, and account verified, it is time to create your first project! Click the **Create Project** button and give your project a name. Next, we will be choosing web browser (server-side encryption) for this tutorial. Feel free to add the Uplink CLI later. In the next step, we suggest generating a 12-word passphrase and storing it somewhere safe and secure. Once you have all of that done, it is now time to create the S3 Credentials. <br><br>
In the Storj sidebar, click **Access**, then **Create S3 Credentials**. Give these credentials a name, continue, and change the permissions as you wish, and click continue. The default permissions should give this access key full access to your project's buckets indefinitley. Lastly, you will be prompted on whether to use the current passphrase or create new ones. We suggest using the current to get started. Confirm the details and click continue!
<br><br>
**Important:** Now you should be presented with an Access Key, Secert Key, and Endpoint on Storj. Make sure to copy these and store them safely as well. These are granted all of the permissions you set up previously, so it is important to keep them safe.

### Secrets
In your forked repl, you will have a section to enter secrets. Enter the keys we generated previously on Storj for your Access Grant. If you did not enter them upon the first time opening your repl, you can open the secrets tab from the Tools section.

### boto3
Because we are using Replit, there is no need to install this library! However, we want to point out it's usage as it is how we are interacting with our S3 bucket configured on Storj. We handle the CRUD operations in ```upload.py``` where the secrets you entered earlier are imported as environment variables and used to interact with S3.

## Usage
In order to use this Repl, you will need to fork it to your personal account and follow the steps in the Getting Started section abve. Once you have the repl forked, and secrets saved, you should be good to go!🚀

## Deployment
If your goal is shared storage, you can deploy the project to the internet and even add a domain name! Replit's streamlined deployment process allows for a simple development --> production pipeline, just follow the instructions after clicking the **Deploy** button in the top right corner!
