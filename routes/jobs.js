const express = require("express")
const router = express.Router()
const JobModel = require("../models/jobs.js")
const UserModel = require("../models/users.js")
const fs = require('fs');
const AWS = require('aws-sdk');
const { config } = require('dotenv');
const passport = require("passport")
config();

const ID = process.env.AWS_ID
const SECRET = process.env.AWS_SECRET
const BUCKET_NAME = process.env.AWS_BUCKET

/*
{
    "name": "Benjamin",
    "email": "example@google.com",
    "password": "jfioehfiafho"
}
*/

/* 
{
    "client": "60112a6e5d720c04ca3ca07e",
    "jobTitle": "New Job",
    "buildAddress": "6 Langdon Lane Bellmere 4510",
    "designDocs": {
        "link": "examplelink.com",
        "description": "Great balls of fire"
    }
}
*/

//GET all jobs
//GET singular job

//CREATE Job
//UPDATE Top level job properties
//DELETE Job

//CREATE Job Stage
//UPDATE Job Stage properties
//DELETE Job Stage

router.post("/upload", (req, res) => {
    console.log(req.files)
    console.log(Object.keys(req.files).length)
    const locations = {
        num: Object.keys(req.files).length,
        links: []
    };
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
    
    const s3Upload = (obj, locations) => {
        // console.log(typeof obj)
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET
        })
        // var base64data = Buffer.from(obj, 'binary');
        const params = {
            Bucket: BUCKET_NAME,
            Key: obj.name, // File name you want to save as in S3
            Body: obj.data
        };
        // let location = ''
        // Uploading files to the bucket
        s3.upload(params, (err, data) => {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully.`);
            locations.links.push({link: data.Location})
            console.log(locations)
            console.log(data.Location);
            // return data.Location

            // return location
            if (locations.links.length === locations.num){
                res.send({locations: locations.links})
            }
        })
        // .then(data => {
        //     return data
        // })
    }
    uploadFileNew(req.files, locations)
    // console.log(locations)
    // res.send({locations: locations})
    // res.send("sssd")
})

//GET JOBS
router.post("/get", (request, response) => {
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

//GET JOB
router.get("/:id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => response.status(200).send(job))
    .catch(error => response.send(error.message))
})

//CREATE JOB
router.post("/", (request, response, next) => {
    JobModel.create(request.body)
    .then((document) => {
        UserModel.findById(request.body.client)
        .then()
        .then(user => {
            user.jobs.push(document)
            user.save()
            .then((user) => {
                console.log("loggin in")

                request.logIn(user, (error) => {
                    if (error) throw error
                    console.log("passport session user")
                    console.log(request.session.passport.user)
                    // response.send({user: request.user})
                    // response.sendStatus(200)
                })
                // .then(() => response.send(200))
                // request.logIn(user, (error) => {
                //     if (error) throw error
                //     console.log(user)
                //     // response.send("Job Created")
                // })
            })
        })
        // .then(() => response.sendStatus(200))
        .then(() => response.status(201).send(document))
    })
    .catch((error) => response.status(406).send(error.message))    
})



// //UPDATE PRODUCT WHOLE
// router.put("/:id", (request, response) => {
//     // job = JobModel.findById()
//     JobModel.findOneAndReplace({_id: request.params.id}, request.body)
//     .then(document => response.send(document))
//     .catch(error => response.send(error))
// })


//UPDATE JOB
router.patch("/:id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => {
        job.jobComplete = request.body.jobComplete || job.jobComplete
        job.description = request.body.description || job.description
        job.buildAddress = request.body.buildAddress || job.buildAddress

        console.log(job.designDocs)
        console.log(request.body.designDocs)
        if (request.body.designDocs){
            job.designDocs = job.designDocs.concat(request.body.designDocs)
        }
        // job.stages.concat(request.body.stages)

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

// //CREATE JOB STAGE
// router.post("/:id/:stage_id", (request, response) => {
//     JobModel.findById(request.params.id)
//     .then(job => {
//         //get index
//         index = request.params.stage_id

//         job.stages.push()

//         //status
//         job.stages[index].status = request.body.status || job.stages[index].status

//         //owed and paid
//         const origOwed = job.stages[index].owed
//         if (request.body.owed !== null){
//             job.stages[index].owed = request.body.owed
//         }
//         const newOwed = job.stages[index].owed
//         if (newOwed < origOwed){
//             job.stages[index].paid = job.stages[index].paid + origOwed - newOwed
//         }

//         //pictures and comments
//         if (request.body.pictures){
//             job.stages[index].pictures = job.stages[index].pictures.concat(request.body.pictures )
//         }
//         if (request.body.comments){
//             job.stages[index].comments = job.stages[index].comments.concat(request.body.comments)
//         }

//         job.save()
//         return job
//     })
//     .then(job => {
//         console.log(job)
//         response.send(job)
//     })
//     .catch(error => response.send(error)) 
// })

//UPDATE JOB STAGE 
router.patch("/:id/:stage_id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => {
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

        //if status = payment pending and amount owed = 0, 
        // then status gets set to Complete, and next stage gets set to InProgress

        if (job.stages[index].status === "PaymentPending" && job.stages[index].owed === 0){
            job.stages[index].status = "Complete"
        }
        if (job.stages[index].status === "Complete"){
            console.log("Going to next stage")
            const indexNum = parseInt(index, 10);
            job.stages[indexNum + 1].status = "InProgress"
        }

        //pictures and comments
        if (request.body.pictures){
            job.stages[index].pictures = job.stages[index].pictures.concat(request.body.pictures)
        }
        if (request.body.comments){
            job.stages[index].comments = job.stages[index].comments.concat(request.body.comments)
        }

        job.save()
        return job
    })
    .then(job => {
        // console.log(job)
        response.send(job)
    })
    .catch(error => response.send(error)) 
})

//DELETE JOB STAGE
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

//DELETE JOB
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