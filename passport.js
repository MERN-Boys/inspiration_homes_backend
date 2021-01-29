const passport = require("passport")
const User = require("./models/users.js")

// {username: "foo", password: "bar"} => {username: "foo", hash: "iugafugifdaugiafdifwo"}
passport.serializeUser(function(user, done) {
    done(null, user)
})
// {username: "foo", hash: "iugafugifdaugiafdifwo"} => {username: "foo", password: "bar"}
passport.deserializeUser(function(user, done) {
    done(null, user)
})

passport.use(User.createStrategy())