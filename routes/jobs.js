const express = require("express")
const router = express.Router()
const JobModel = require("../models/jobs.js")
const UserModel = require("../models/users.js")

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


//GET JOBS
router.get("/", (request, response) => {
    JobModel.find()
    .then(jobs => response.send(jobs))
    .catch(error => response.send(error))
})

//GET JOB
router.get("/:id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => response.status(200).send(job))
    .catch(error => response.send(error.message))
})

//CREATE JOB
router.post("/", (request, response) => {
    JobModel.create(request.body)
    .then((document) => {
        UserModel.findById(request.body.client)
        .then(user => {
            user.jobs.push(document)
            user.save()
        })
        .then(response.status(201).send(document))
        // response.status(201).send(document)
    })
    .catch((error) => response.status(406).send(error.message))    
})

//UPDATE PRODUCT WHOLE
router.put("/:id", (request, response) => {
    // job = JobModel.findById()
    JobModel.findOneAndReplace({_id: request.params.id}, request.body)
    .then(document => response.send(document))
    .catch(error => response.send(error))
})


//UPDATE JOB PART
router.patch("/:id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => {
        job.jobComplete = request.body.jobComplete || job.jobComplete
        job.jobTitle = request.body.jobTitle || job.jobTitle
        job.buildAddress = request.body.buildAddress || job.buildAddress

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

//UPDATE JOB STAGE PART
router.patch("/:id/:stage_id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => {
        //get index
        index = request.params.stage_id

        //status
        job.stages[index].status = request.body.status || job.stages[index].status

        //owed and paid
        const origOwed = job.stages[index].owed
        if (request.body.owed !== null){
            job.stages[index].owed = request.body.owed
        }
        const newOwed = job.stages[index].owed
        if (newOwed < origOwed){
            job.stages[index].paid = job.stages[index].paid + origOwed - newOwed
        }

        //pictures and comments
        if (request.body.pictures){
            job.stages[index].pictures = job.stages[index].pictures.concat(request.body.pictures )
        }
        if (request.body.comments){
            job.stages[index].comments = job.stages[index].comments.concat(request.body.comments)
        }

        job.save()
        return job
    })
    .then(job => {
        console.log(job)
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
            let index = user.jobs.indexOf(job._id)
            if (index !== -1){
                user.jobs.splice(index, 1)
            }

            // user.jobs = user.jobs.filter(e => e != job._id)
            console.log(user.jobs)
            user.save()
            job.delete()
            return "Job Deleted"
        })
        .then(confirmation => response.status(200).send(confirmation))
    })
    .catch(error => response.status(406).send(error))
})

module.exports = router