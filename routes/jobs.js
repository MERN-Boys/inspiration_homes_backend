//get express library
const express = require("express")

//define router obj from express
const router = express.Router()

//import the job model
const JobModel = require("../models/jobs.js")

//import the user model
const UserModel = require("../models/users.js")

//import aws upload library
const AWS = require('aws-sdk');

//get .env variables
const { config } = require('dotenv');
// const passport = require("passport")

//initialise env variables
config();

//define each of the aws variables from env
const ID = process.env.AWS_ID
const SECRET = process.env.AWS_SECRET
const BUCKET_NAME = process.env.AWS_BUCKET

//create user example for postman
/*
{
    "name": "Benjamin",
    "email": "example@google.com",
    "password": "jfioehfiafho"
}
*/

//create job example for postman
/* 
{
    "client": "60112a6e5d720c04ca3ca07e", //replace with existing user obj string
    "jobTitle": "New Job",
    "buildAddress": "6 example address QLD",
    "designDocs": [
    ]
}
*/

//upload image/s
router.post("/upload", (req, res) => {

    //console logs for debug to check existence of files in upload
    console.log(req.files)
    console.log(Object.keys(req.files).length)

    //create obj that will store links for the response obj back to front end
    const locations = {
        num: Object.keys(req.files).length,
        links: []
    };

    //initial function that iterates through the files, creating a promise that recieves the s3Upload callback function
    const uploadFileNew = (arrOfFiles, locations) => {
        var promises=[];
        for (const [key, value] of Object.entries(arrOfFiles)) {
            promises.push(s3Upload(value, locations));
        }
        Promise.all(promises)
        .catch(function(err){
            res.send(err);
            // console.log(err)
        })         
    }
    
    //for each file in the obj, this function uploads the file to aws and returns a url, and then adds that url to the locations obj
    //once the locations links arr length equals the length of the files initially fed to the function it sends the location links object back to the front end
    const s3Upload = (obj, locations) => {

        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        })

        const params = {
            Bucket: BUCKET_NAME,
            Key: obj.name, // File name you want to save as in S3
            Body: obj.data
        };

        // Uploading files to the bucket
        s3.upload(params, (err, data) => {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully.`);
            locations.links.push({link: data.Location})
            console.log(locations)
            console.log(data.Location);

            // return location
            if (locations.links.length === locations.num){
                res.send({locations: locations.links})
            }
        })
    }

    //runs the upload file new function, feeding in the files sent from the request, and the empty locations obj
    uploadFileNew(req.files, locations)
})

//GET JOBS
router.post("/get", (request, response) => {
    
    //get user obj
    const user = request.body.user

    //get all jobs and send back to front end if builder
    if (user.role === "Builder"){
        JobModel.find()
        .then(jobs => response.send(jobs))
        .catch(error => response.send(error))
    }

    //if not builder send only jobs that are in the user obj jobs arr
    else {
        JobModel.find({'_id': { $in: user.jobs}})
        .then(jobs => response.send(jobs))
        .catch(error => response.send(error))
    }
})


//GET JOB - Gets individual job and sents back to client, only used in testing
router.get("/:id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => response.status(200).send(job))
    .catch(error => response.send(error.message))
})

//CREATE JOB - creates job from request body, then adds job id to user jobs array, and re logs in user and sends updated user to front end
router.post("/", (request, response, next) => {
    JobModel.create(request.body)
    .then((document) => {
        UserModel.findById(request.body.client)
        .then()
        .then(user => {
            user.jobs.push(document)
            user.save()
            .then((user) => {
                console.log("addin job to user")

                request.logIn(user, (error) => {
                    if (error) throw error
                    // console.log("passport session user")
                    // console.log(request.session.passport.user)
                })

                console.log(user)
                response.send({"user": user})
            })
        })
    })
    .catch((error) => response.status(406).send(error.message))    
})

//UPDATE JOB - updates main level of job, only description, address and design doc images
router.patch("/:id", (request, response) => {
    //find job
    JobModel.findById(request.params.id)
    .then(job => {

        //update description or address if present
        job.description = request.body.description || job.description
        job.buildAddress = request.body.buildAddress || job.buildAddress

        console.log(job.designDocs)
        console.log(request.body.designDocs)

        //add to design docs if present
        if (request.body.designDocs){
            job.designDocs = job.designDocs.concat(request.body.designDocs)
        }

        //mark as modified to make sure the document saves, not sure if necessary now but scared to delete lol
        job.markModified('anything');
        job.save(function(err){
            if(err){
                 console.log(err)
                 return;
            }
        })
        response.send(job)
    })
    .catch(error => response.send(error))
})

/* 
//UPDATE JOB STAGE - 
This is the big cheese route. After getting the job we use any data sent to 
this route to update only those elements of a stage, and/or some specific
higher job properties like job complete or clientName incase the name changes.

//--Other Features--//
- Changing "Paid" and "Owed" is a simple calculation to track whats currently been paid by the client when the owed value is reduced.

- When a stage of a job has a status of payment pending and its owed value is reduced the zero the route changes status to complete
and sets the following stage status to InProgress

- When the final stage is set to complete the jobComplete bool is set to true

- After all logic the job is saved, and then a get is run on the jobs model
to get all the jobs relevent to the user and send them back to the front end

*/
router.patch("/:id/:stage_id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => {
        if (request.body.user.role === "Client"){
            job.clientName = request.body.user.name
        }

        console.log(request.body)

        //get index
        index = request.params.stage_id

        //status: Only change from InProgress to PaymentPending
        job.stages[index].status = request.body.status || job.stages[index].status
        
        //owed and paid
        const origOwed = job.stages[index].owed
        if (request.body.owed !== undefined){
            job.stages[index].owed = request.body.owed

            const newOwed = job.stages[index].owed
            if (newOwed < origOwed){
                job.stages[index].paid = job.stages[index].paid + origOwed - newOwed
            }
        }

        //If payment made set stage to complete
        if (job.stages[index].status === "PaymentPending" && job.stages[index].owed === 0){
            job.stages[index].status = "Complete"
        }

        //if stage complete set next stage to inprogress
        if (job.stages[index].status === "Complete"){
            if (parseInt(index, 10) === job.stages.length - 1){
                job.jobComplete = true
                console.log("Job Complete!")
            }
            else {
                console.log("Going to next stage")
                const indexNum = parseInt(index, 10);
                job.stages[indexNum + 1].status = "InProgress"
                console.log(job.stages[indexNum + 1].status)
            }
        }

        //pictures and comments
        if (request.body.pictures){
            job.stages[index].pictures = job.stages[index].pictures.concat(request.body.pictures)
        }
        if (request.body.comments){
            job.stages[index].comments = job.stages[index].comments.concat(request.body.comments)
        }

        job.save()
        .then(() => {
            const user = request.body.user
    
            if (user.role === "Builder"){
                JobModel.find()
                .then(jobs => response.send(jobs))
                .catch(error => response.send(error))
            }
            else {
                JobModel.find({'_id': { $in: user.jobs}})
                .then(jobs => response.send(jobs))
                .catch(error => response.send(error))
            }
        })
    })
    .catch(error => response.send(error)) 
})

//DELETE JOB STAGE - Used in testing to delete job stages, job stages arent deleted in production 
router.delete("/:id/:stage_id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => {
        let index = request.params.stage_id
        job.stages.splice(index, 1)
        job.save()
        return job
    })
    .then(confirmation => response.status(200).send(confirmation))
    .catch(error => response.status(406).send(error))
})

//DELETE JOB - Used in testing, jobs arent deleted in production
router.delete("/:id", (request, response) => {
    JobModel.findById(request.params.id)
    .then((job) => {
        console.log(job.client)
        UserModel.findById(job.client)
        .then(user => {
            if (user){
                let index = user.jobs.indexOf(job._id)
                if (index !== -1){
                    user.jobs.splice(index, 1)
                }
    
                user.save()
            }
            job.delete()
            return "Job Deleted"
        })
        .then(confirmation => response.status(200).send(confirmation))
    })
    .catch(error => response.status(406).send(error))
})

module.exports = router