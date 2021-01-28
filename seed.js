const UserModel = require("./models/users.js")
const JobModel = require("./models/jobs.js")

const mongoose = require("mongoose")
const { config } = require('dotenv');

config();
const username = process.env.MONGO_USERNAME  
const password = process.env.MONGO_PASSWORD
const database = process.env.MONGO_DBNAME  

const connectionString = `mongodb+srv://${username}:${password}@cluster0.rqngg.mongodb.net/${database}?retryWrites=true&w=majority`

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to the database"))
.catch(error => console.log(error))

const users = [
    new UserModel({
        "name": "TestClient",
        "email": "example@google.com",
        "password": "password"
    }),
    new UserModel({
        "name": "Builder",
        "email": "example@google.com",
        "password": "password"
    })
]

const jobs = [
    new JobModel({
        "client": "0",
        "jobTitle": "New Job",
        "buildAddress": "6 Langdon Lane Bellmere 4510",
        "designDocs": {
            "link": "examplelink.com",
            "description": "Great balls of fire"
        }
    })
]
UserModel.deleteMany({})
.then(() => JobModel.deleteMany({}))
.then(() => {
    users.map(async(u, index) => {
        u.save((err, result) => {
            if (index === users.length - 1){
                console.log("SEEDED USERS")
                UserModel.findOne({"name": "TestClient"})
                .then((user) => {
                    jobs[0].client = user._id
                    return jobs[0]
                })
                .then(job => {
                    job.save((err, result) => {
                        console.log("SEEDED JOB")
                        mongoose.disconnect();
                    })
                })
            }
        })
    })
})

