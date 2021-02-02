const fs = require('fs');
const AWS = require('aws-sdk');
const { config } = require('dotenv');
config();

const ID = process.env.AWS_ID
const SECRET = process.env.AWS_SECRET
const BUCKET_NAME = process.env.AWS_BUCKET

const uploadFile = (arrOfFiles) => {
    // Read content from the file
    // const fileContent = fs.readFileSync(fileName);

    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    })

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'orb.png', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

const uploadFileNew = (arrOfFiles) => {
    // Read content from the file
    // const fileContent = fs.readFileSync(fileName);

    var promises=[];

    for(var i=0; i<arrOfFiles.length; i++){
        var file = arrOfFiles[i];
        promises.push(s3Upload(file));
    }
    Promise.all(promises).then(function(data){
        // res.send(data);
        console.log("Promises")
    }).catch(function(err){
        // res.send(err.stack);
        console.log(err)
    }) 
    // Setting up S3 upload parameters
    
}

const s3Upload = (obj) => {
    // console.log(obj)
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
    })

    const params = {
        Bucket: BUCKET_NAME,
        Key: obj.filename, // File name you want to save as in S3
        Body: obj.content
    };

    // Uploading files to the bucket
    return s3.upload(params, (err, data) => {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully.`);
        console.log(data.Location);
    })
}

const fileContent1 = fs.readFileSync("orb.png", "utf8");
const fileContent2 = fs.readFileSync("orb.png", "utf8");
const fileContent3 = fs.readFileSync("orb.png", "utf8");

let arrOfFiles = [
    {
        content: fileContent1,
        filename: "orb1.png"
    },
    {
        content: fileContent2,
        filename: "orb2.png"
    },
    {
        content: fileContent3,
        filename: "orb3.png"
    },
]

uploadFileNew(arrOfFiles)