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

//UPDATE JOB STAGES
router.patch("/:id", (request, response) => {
    JobModel.findById(request.params.id)
    .then(job => {
        stage = job.stages.filter(stage => {
            return stage.index == request.body.index
        })
        // console.log(stage)


        for (const key of Object.keys(request.body)) {
            job.stages[stage[0].index][key] = request.body[key]
        }
        console.log(job.stages[0])
        // job.stages[stage[0].index] = request.body.stages[0]
        job.save()
        .then(document => {
            response.send(document)
        })
        .catch(error => response.send(error)) 
    })

    // job.stages[result] = request.body
    // JobModel.update(request.params.id, request.body)
    // .then(document => response.send(document))
    // .catch(error => response.send(error))
})

// //UPDATE JOB PART
// router.patch("/:id", (request, response) => {
//     JobModel.findByIdAndUpdate(request.params.id, request.ody)
//     .then(document => response.send(document))
//     .catch(error => response.send(error))
// })

//DELETE PRODUCT
router.delete("/:id", (request, response) => {
    JobModel.findByIdAndDelete(request.params.id)
    .then(confirmation => response.status(200).send(confirmation))
    .catch(error => response.status(406).send(error))
})

module.exports = router