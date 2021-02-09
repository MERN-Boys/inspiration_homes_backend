const AWS = require('aws-sdk')

const ID = process.env.AWS_ID
const SECRET = process.env.AWS_SECRET
const BUCKET_NAME = process.env.AWS_BUCKET

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
})

const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        LocationConstraint: "ap-southeast-2"
    }
}

s3.createBucket(params, (err, data) => {
    if (err) console.log(err)
    else console.log('Bucket Created Successfully', data.location)
})

//Used in testing to create a bucket from the app