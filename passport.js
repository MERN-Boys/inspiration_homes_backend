const passport = require("passport")
const User = require("./models/users.js")

// {username: "foo", password: "bar"} => {username: "foo", hash: "iugafugifdaugiafdifwo"}
// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user)
})
// {username: "foo", hash: "iugafugifdaugiafdifwo"} => {username: "foo", password: "bar"}
passport.deserializeUser(function(user, done) {
    done(null, user)
})


passport.use(User.createStrategy())