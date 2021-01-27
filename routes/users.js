const express = require("express")
const router = express.Router()
const UserModel = require("../models/users.js")

//post
//users/

//post
//signin
//users/:id

//put
//edit
//users/:id

//signout
//edit
//user/:id

//GET PRODUCTS
router.get("/", (request, response) => {
    UserModel.find()
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
    UserModel.create(request.body)
    .then((document) => response.status(201).send(document))
    .catch((error) => response.status(406).send(error.message))    
})

module.exports = router;