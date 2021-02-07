//npm init
//yarn add express
//install nodemon globally
//yarn add mongoose

const express = require("express")
const app = express()
const mongoose = require("mongoose")
// const User = require("./models/users.js")
const passport = require("passport")
const cors = require("cors")
const session = require('express-session')
const cookieParser = require('cookie-parser')
const fileupload = require("express-fileupload");
const MongoStore = require('connect-mongo')(session)
require('./passport.js')

mongoose.set('useCreateIndex', true);

const { config } = require('dotenv');

config();
const username = process.env.MONGO_USERNAME  
const password = process.env.MONGO_PASSWORD
const database = process.env.MONGO_DBNAME  
// console.log(username)
// console.log(password)
// console.log(database)

const connectionString = `mongodb+srv://${username}:${password}@cluster0.rqngg.mongodb.net/${database}?retryWrites=true&w=majority`

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to the database"))
.catch(error => console.log(error))


// origin: "https://inspiration-homes.herokuapp.com/", // This should be changed to our front-end url
app.use(cors({
  origin: "http://localhost:3000/", // This should be changed to our front-end url
  credentials: true
}))

app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
      mongooseConnection: mongoose.connection
  })
}))

app.use(cookieParser('secret'))


// //Middleware
app.use(express.json())
app.use(fileupload());
app.use(passport.initialize())



app.use(passport.session())

app.use("/jobs", require("./routes/jobs.js"))

app.use("/users", require("./routes/users.js"))

//
app.get("/", (request, response) => {
    // console.log(request)
    console.log("Root Path - Get Request")
    response.send("Welcome to the THUNDER")
})


app.listen(process.env.PORT || 5000, () => {})