const aws = require('aws-sdk');
const moment = require('moment')

const s3 = new aws.S3({ signatureVersion: 'v4' })

const getUrlToSignFile = async (event,context)=>{

  const fileName = event.pathParameters['filename'];
  console.log('Parameters',event.pathParameters);
  console.log('FileName',fileName);
  try {
    const newName = generateNewName(fileName)
    const link = await getSignURL(newName)
    
    return {
      "statusCode": 200,
      "body": JSON.stringify({ error:false,url: link })
    }
  } catch (error) {
    console.log('Error',error);
    return {
      "statusCode": 500,
      "body": JSON.stringify({ error:true,url: '' })
    }
  }

}

const getRandomArbitrary = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const generateNewName = (name) => {
  const date = moment().format('Y-M-D')
  const randomPart = getRandomArbitrary(1000,9999)
  const newName = date+"-"+randomPart+"-"+name
  return newName
}

const getSignURL = async(fileName) => {  
  const signedUrl = await s3.getSignedUrlPromise("putObject", {
    Key: `${fileName}`,
    Bucket: process.env.BUCKET,
    Expires: 300
  })
  return signedUrl
}

module.exports = {getUrlToSignFile}