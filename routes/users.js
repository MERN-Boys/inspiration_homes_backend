const express = require("express")
const router = express.Router()
const User = require("../models/users.js")
const passport = require("passport")

//post
//create
//users/

//post signin
//signin
//users/:id

//put
//edit
//users/:id

//signout
//edit
//user/:id

router.post("/register", (req, res) => {
    User.register(new User({name: req.body.name, email: req.body.email}), req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            res.sendStatus(400)
        }
        passport.authenticate('local')(req, res, () => {
            res.send({name: user.name, email: user.email})
        })
        // Session management
        // Send back session, user
        // return res.sendStatus(200)
    })
})

// #authenticate 2 Args
// 1: strategy
// 2: Callback
router.post("/login", (req, res, next) => {
    console.log("loggin in")
    passport.authenticate("local", (err, user) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        if (!user) {
            res.sendStatus(401)
        } else {
            // No error, user found
            // "login"
            req.logIn(user, (error) => {
                if (error) throw error
                console.log(user)
                res.send({email: user.email})
            })
        }
    })(req, res, next)
})

router.get("/me", (req, res) => {
    // find the user
    // send back the user
    console.log("Hitting /me")
    if (req.user) {
        res.send({email: req.user.email})
    } else {
        res.send({email: null})
    }
})

router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

// GET PRODUCTS
router.get("/", (request, response) => {
    User.find()
    .then(user => response.send(user))
    .catch(error => response.send(error))
})

// //GET PRODUCT
// router.get("/:id", (request, response) => {
//     UserModel.findById(request.params.id)
//     .then(job => response.status(200).send(job))
//     .catch(error => response.send(error.message))
// })

// //CREATE PRODUCT
// router.post("/", (request, response) => {
//     UserModel.create(request.body)
//     .then((document) => response.status(201).send(document))
//     .catch((error) => response.status(406).send(error.message))    
// })

// router.delete("/:id", (request, response) => {
//     UserModel.findByIdAndDelete(request.params.id)
//     .then((document) => response.status(200).send(document))
//     .catch((error) => response.status(406).send(error.message))    
// })

module.exports = router;