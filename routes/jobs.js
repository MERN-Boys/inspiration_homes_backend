const express = require("express")
const router = express.Router()
const JobModel = require("../models/jobs.js")

/*
{
    "client": "600e6677219fe15ce8a96068",
    "jobTitle": "New Job",
    "buildAddress": "6 Langdon Lane Bellmere 4510",
    "designDocs": "example-link.com"
}
*/


//GET PRODUCTS
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
    .then((document) => response.status(201).send(document))
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

//UPDATE JOB Stages
router.patch("/:id/:stage_id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => {

        index = request.params.stage_id

        //status
        job.stages[index].status = request.body.status || job.stages[index].status

        //owed and paid
        const origOwed = job.stages[index].owed
        job.stages[index].owed = request.body.owed || origOwed
        const newOwed = job.stages[index].owed

        if (newOwed < origOwed){
            job.stages[index].paid = origOwed - newOwed
        }

        //pictures and comments
        if (request.body.pictures){
            job.stages[index].pictures = job.stages[index].pictures.concat(request.body.pictures )
        }
        if (request.body.comments){
            job.stages[index].comments = job.stages[index].comments.concat(request.body.comments)
        }

        // job.stages[stage[0].index] = request.body.stages[0]
        job.save()
        console.log(job)
        return job
    })
    .then(job => {
        console.log(job)
        response.send(job)
    })
    .catch(error => response.send(error)) 
})

//DELETE PRODUCT
router.delete("/:id", (request, response) => {
    JobModel.findByIdAndDelete(request.params.id)
    .then(confirmation => response.status(200).send(confirmation))
    .catch(error => response.status(406).send(error))
})

module.exports = router