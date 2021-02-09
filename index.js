//npm init
//yarn add express
//install nodemon globally
//yarn add mongoose

//does lots of express passport stuff to initialise the express server, mongoose library, passport and sessions
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const passport = require("passport")
const cors = require("cors")
const session = require('express-session')
const cookieParser = require('cookie-parser')
const fileupload = require("express-fileupload");
const MongoStore = require('connect-mongo')(session)
require('./passport.js')

//gets rid of a depr message
mongoose.set('useCreateIndex', true);

//gets env
const { config } = require('dotenv');
config();

//define vars to connect to mongo db
const username = process.env.MONGO_USERNAME  
const password = process.env.MONGO_PASSWORD
const database = process.env.MONGO_DBNAME  

// //Use to run backend tests
// let connectionString
// const env = process.env.NODE_ENV || "development"
// if( env === 'test') {
//   connectionString = `mongodb+srv://${username}:${password}@cluster0.rqngg.mongodb.net/testdb?retryWrites=true&w=majority`;
// } else {
//   connectionString = `mongodb+srv://${username}:${password}@cluster0.rqngg.mongodb.net/${database}?retryWrites=true&w=majority`
// }

let connectionString = `mongodb+srv://${username}:${password}@cluster0.rqngg.mongodb.net/${database}?retryWrites=true&w=majority`;



mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to the database"))
.catch(error => console.log(error))

//used to auth access origin, and switch between local and deployed
app.use(cors({
  origin: "https://inspiration-homes.herokuapp.com",
  // origin: "http://localhost:3000", // This should be changed to our front-end url
  credentials: true
}))

//used to create session obj
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
      mongooseConnection: mongoose.connection
  })
}))

//used to create yummy cookies
app.use(cookieParser('secret'))


//Middleware for json parsing, file parsing, and passport init
app.use(express.json())
app.use(fileupload());
app.use(passport.initialize())
app.use(passport.session())

//middleware routes files for jobs and users
app.use("/jobs", require("./routes/jobs.js"))
app.use("/users", require("./routes/users.js"))

//test route to check backend is online
app.get("/", (request, response) => {
    // console.log(request)
    console.log("Root Path - Get Request")
    response.send("Welcome to the THUNDER")
})


app.listen(process.env.PORT || 5000, () => {})

module.exports = {app}
