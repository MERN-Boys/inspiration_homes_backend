//npm init
//yarn add express
//install nodemon globally
//yarn add mongoose

const express = require("express")
const app = express()
const mongoose = require("mongoose")

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

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

//Middleware
app.use(allowCrossDomain)
app.use(express.json())

app.use("/jobs", require("./routes/jobs.js"))

app.use("/users", require("./routes/users.js"))

//
app.get("/", (request, response) => {
    // console.log(request)
    console.log("Root Path - Get Request")
    response.send("Welcome to the THUNDER")
})


app.listen(process.env.PORT || 5000, () => {})