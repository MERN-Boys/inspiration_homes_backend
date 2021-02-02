const express = require("express")
const router = express.Router()
const User = require("../models/users.js")
const passport = require("passport")
const { check, validationResult } = require('express-validator');

// passport.use(
//     new passport.Strategy({

//         usernameField : 'email',

//         passwordField : 'password',

//         passReqToCallback : true 
//     },
//     function(req, username, password, done) {

//         User.findOne({email: username}, function(err, user) {
//             if (err) { return done(err); }
//             if (!user) {
//                  return done(null, false, { message: 'Incorrect username.' });
//              }
//             if (!user.validPassword(password)) {
//                  return done(null, false, { message: 'Incorrect password.' });
//             }
//             return done(null, user);
//         })

//     })
// )

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

// router.post('/register', passport.authenticate('local-signup',  (err, user) => {
//     // successRedirect : '/', // redirect to the secure profile section
//     // failureRedirect : '/register', // redirect back to the signup page if there is an error
//     // failureFlash : true // allow flash messages
// }));

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

// #authenticate 2 Args
// 1: strategy
// 2: Callback
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
                console.log(user)
                res.send({user: req.user})
            })
        }
    })(req, res, next)
})

router.put("/edit", (req, res) => {
    User.findById(req.body._id)
    passport.authenticate('local', (err, user) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        if (!user) {
            res.sendStatus(401)
        } else {
            req.logIn(user, (error) => {
                if (error) throw error
                console.log(user)
                res.send({user: req.user})
            })
        }
    })(req, res, next)
})

router.get("/me", (req, res) => {
    // find the user
    // send back the user
    console.log("Hitting /me")
    if (req.user) {
        res.send({user: req.user})
    } else {
        res.send({user: null})
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

router.delete("/:id", (request, response) => {
    User.findByIdAndDelete(request.params.id)
    .then((document) => response.status(200).send(document))
    .catch((error) => response.status(406).send(error.message))    
})

router.delete("/", (request, response) => {
    User.deleteMany({})
    .then(() => response.status(200))
    .catch((error) => response.status(406).send(error.message))    
})

module.exports = router;