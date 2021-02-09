const express = require("express")
const router = express.Router()
const User = require("../models/users.js")
const passport = require("passport")
const { check, validationResult } = require('express-validator');

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

/* 
//creates user model object, 
validates email field is actually an email, 
registers the user and authenticates using passport strategy
logs in and sends user object back
*/
router.post("/register", 
    [check('name').isLength({ min: 3 }),
    //validate email is actually a valid email like a@b.c
    check('email').isEmail(),],
    (req, res, next) => {
        //get errors from validation check
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        //if email correct format then register new user
        User.register(new User({name: req.body.name, email: req.body.email}), req.body.password, (err, user) => {
            if (err) {
                console.log(user)
                console.log(err)
                res.send(err)
            }
            passport.authenticate('local', (err, user) => {
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
                        res.send({user: req.user})
                    })
                }
            })(req, res, next)
        })
})

/* 
authenticates login details and logs in user, then sends user obj back to front end
*/
router.post("/login", (req, res, next) => {
    console.log("loggin in")
    passport.authenticate('local', (err, user) => {
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
                // console.log(user)
                res.send({"user": req.user})
            })
        }
    })(req, res, next)
})

//edit user route, does same as register except changes existing users name/email and uses passport setpassword function
router.put("/:id", 
    [check('name').isLength({ min: 3 }),
    //validate email is actually a valid email like a@b.c
    check('email').isEmail(),],
    (req, res) => {
        //get errors from validation check
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
    }
    User.findById(req.params.id)
    .then(user => {
        user.name = req.body.name
        user.email = req.body.email
        //req.body.oldPassword
        user.setPassword(req.body.password)
        .then(() => user.save())
        .then((user) => {
            let newUser = user
            console.log("user edited")

            req.logIn(user, (error) => {
                if (error) {
                    console.log(error)
                    throw error
                }
                console.log("passport session user")
                console.log(req.session.passport.user)

                res.send({"user": user})
            })
        })
    })
    .catch(error => res.send(error))
})

//gets the current user object from the database when present in the session 
router.get("/me", (req, res) => {
    // find the user
    // send back the user
    console.log("Hitting /me")
    if (req.user) {
        // console.log(req.user)
        User.findById(req.user._id)
        .then((user) => res.send({user: user}))
        .catch(error => res.send(error))
        // res.send({user: req.user})

    } else {
        res.send({user: null})
    }
})

//logs the user out
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

// GET USERS - Only used in testing
router.get("/", (request, response) => {
    User.find()
    .then(user => response.send(user))
    .catch(error => response.send(error))
})

// DELETE USER - Only used in testing
router.delete("/:id", (request, response) => {
    User.findByIdAndDelete(request.params.id)
    .then((document) => response.status(200).send(document))
    .catch((error) => response.status(406).send(error.message))    
})

// DELETE ALL USERS - Only used in testing
router.delete("/", (request, response) => {
    User.deleteMany({})
    .then(() => response.status(200))
    .catch((error) => response.status(406).send(error.message))    
})

module.exports = router;