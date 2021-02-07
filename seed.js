const UserModel = require("./models/users.js")
const JobModel = require("./models/jobs.js")
const passport = require("passport")

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
    ({
        "name": "Builder",
        "email": "builder@google.com",
        "password": "password",
        "role": "Builder"
    }),
    ({
        "name": "TestClient",
        "email": "client@google.com",
        "password": "password"
    })
]

const jobs = [
    new JobModel({
        "client": "0",
        "clientName": "",
        "description": "description of job",
        "buildAddress": "dummy address",
        "designDocs": [{
            "link": "https://consecration-abomination.s3.amazonaws.com/building_plans.png",
        }]
    })
]
UserModel.deleteMany({})
.then(() => JobModel.deleteMany({}))
.then(() => {
    users.map(async(obj, index) => {
        console.log(obj)
        UserModel.register(new UserModel({name: obj.name, email: obj.email, role: obj.role}), obj.password, (err, user) => {
            if (err) {
                console.log(user)
                console.log(err)
            }
            passport.authenticate('local', (err, user) => {
                if (err) {
                    console.log(err)
                }
                if (!user) {
                } else {
                    req.logIn(user, (error) => {
                    })
                }
            })

            if (index === users.length - 1){
                console.log(index)
                console.log("SEEDED USERS")
                jobs[0].client = user._id
                jobs[0].clientName = user.name
                jobs[0].save((err, result) => {
                    console.log("SEEDED JOB")
                    user.jobs.push(result._id)
                    user.save(() => {
                        mongoose.disconnect()
                    })
                })
            }
        })
    })
})

