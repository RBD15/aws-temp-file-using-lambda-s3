# AWS Lambda Template using Node to Upload Files to S3 Standard with serverless Framework

## Steps

1. Clone Project into local machine
> git clone https://github.com/RBD15/aws-temp-file-using-lambda-s3.git
2. Into new folder
3. Install Node dependencies
> npm i
4. Check that serverless is installed, run into the terminal
> serverless -v
5. Set AWS credentials (in case you dont have it check https://www.serverless.com/framework/docs/providers/aws/guide/credentials)
  * In case you already have the aws credentials, you can use:
    > serverless config credentials --provider provider --key key --secret secret     
  * For More information check https://www.serverless.com/framework/docs/providers/aws/cli-reference/config-credentials
6. Modify providers section on serverless.yml
  * First change 'name-for-my-s3-YYYY-MM-DD' S3 arn, Note: S3 require a unique name for each bucket globally, so take as a reference our example using Date string as part of the name
    ```
    provider:
      name: aws
      runtime: nodejs16.x
      iam:
        role:
          statements:
            - Effect: Allow
              Action: 's3:*'
              Resource: arn:aws:s3:::'name-for-my-s3-YYYY-MM-DD'/*
    ```
  * Second in the same provider section change BUCKET environment variable using the same name you choose in the previous step
    ```
    environment:
      BUCKET: 'name-for-my-s3-YYYY-MM-DD'
    ```
7. Modify s3 name into resources sections 'name-for-my-s3-YYYY-MM-DD' with the same name you choose previously
    ```
    resources:
      Resources:
        S3Bucket:
          Type: 'AWS::S3::Bucket'
          Properties:
            PublicAccessBlockConfiguration:
              BlockPublicAcls: false
              BlockPublicPolicy: false
            BucketName: 'name-for-my-s3-YYYY-MM-DD'
          SampleBucketPolicy:
            Type: AWS::S3::BucketPolicy
            Properties:
              Bucket: !Ref S3Bucket
              PolicyDocument:
                Version: "2012-10-17"
                Statement:
                  - Action:
                      - 's3:GetObject'
                    Effect: Allow
                    Resource: !Join
                      - ''
                      - - 'arn:aws:s3:::'
                        - !Ref S3Bucket
                        - /*
                    Principal: '*'
    ```
8. Run into the terminal
> serverless deploy
9. When the deployment is done you will get a public GET API to request a URL to register a file to the s3 service, this API returns a URL and you will need to make a PUT request to that URL and set the request body as the binary file. that you want to upload.
10. Finally, you can define lifecycle rules in your new BUCKET to define how long you want it to be automatically deleted.