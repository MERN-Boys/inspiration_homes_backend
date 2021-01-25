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

// //GET PRODUCT
// router.get("/:id", (request, response) => {
//     JobsModel.findById(request.params.id)
//     .then(job => response.status(200).send(job))
//     .catch(error => response.send(error.message))
// })

//CREATE PRODUCT
router.post("/", (request, response) => {
    JobModel.create(request.body)
    .then((document) => response.status(201).send(document))
    .catch((error) => response.status(406).send(error.message))    
})

// //UPDATE PRODUCT WHOLE
// router.put("/:id", (request, response) => {
//     JobsModel.findOneAndReplace({_id: request.params.id}, request.body)
//     .then(document => response.send(document))
//     .catch(error => response.send(error))
// })

// //UPDATE PRODUCT PART
// router.patch("/:id", (request, response) => {
//     JobsModel.findByIdAndUpdate(request.params.id, request.ody)
//     .then(document => response.send(document))
//     .catch(error => response.send(error))
// })

// //DELETE PRODUCT
// router.delete("/:id", (request, response) => {
//     JobsModel.findByIdAndDelete(request.params.id)
//     .then(confirmation => response.status(200).send(confirmation))
//     .catch(error => response.status(406).send(error))
// })

module.exports = router