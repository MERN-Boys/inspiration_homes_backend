//get mongoose library
const mongoose = require("mongoose")

//get stage scaffold 
const seedStages = require("./stages.js")

//enforces structure of jobs
const JobsSchema = new mongoose.Schema({
    jobComplete: {
        type: Boolean,
        default: false,
        required: true,
    },
    client: {
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    clientName: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    buildAddress: {
        type: String,
        unique: true,
        required: true
    },
    designDocs: {
        type: [
            {
                link: {type: String},
            }
        ],
        default: []
    },
    stages: {
        type: [
            {
                index: {type: Number, required: true},

                name: {type: String},
                status: {type: String},
                owed: {type: Number},
                paid: {type: Number},
                pictures: {type: [
                    {
                        link: {type: String},
                    }
                ]},
                comments: {type: [
                    {
                        name: {type: String},
                        comment: {type: String}
                    }
                ]}
            }
        ],
        default: seedStages
    }
})

//export job model
const JobModel = mongoose.model("Job", JobsSchema)
module.exports = JobModel