const mongoose = require("mongoose")

/*
### Job will have a:
Primary key id
- JobComplete? = Boolean
- Client = Class Obj required for_key
- Job Title = String required
- Build Address = String required
- Build Design Documents = PDF/Img array 
- Stages  = Obj array required generated from seed
  (For Each Stage)
  - StageIndex =  Number (To keep track of the order they get presented in the app, can reorder them though and if builder needs to create new stage can customise where in the build order it should be by editing this number)
  - StageName = String // Stage Placeholder Names: Pending, Ground Works, Base, Frame, Lock Up/Enclosed, Fixing/Fit Off, PCI, Handover
  - StageStatus = String (Hidden/InProgress/PaymentPending/Complete)
  - Amount Owed = Number 
  - Amount Paid = Number 
  - Pics =  Image/Link
  - Comments = [
    {
User Name
Comment
    }
]

*/
const seedStages = require("./stages.js")

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
        ]
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

const JobModel = mongoose.model("Job", JobsSchema)

module.exports = JobModel