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

const JobsSchema = new mongoose.Schema({
    jobComplete: {
        type: Boolean,
        default: false,
        required: true,

    },
    client: {
        type: mongoose.Types.ObjectId, 
        ref: 'client',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    buildAddress: {
        type: String,
        required: true
    },
    designDocs: {
        type: [String],
        required: false
    },
    stages: [{
        index:  Number,
        name: String,
        status: String,
        owed: Number,
        paid: Number,
        pictures: [String],
        comments: [{
            commenterId: mongoose.ObjectId,
            comment: String
        }]
    }]
    // description: {
    //     type: String,
    //     required: false
    // },
    // price: {
    //     type: Number,
    //     require: true
    // }
    // stores: [Store]
})

const JobModel = mongoose.model("jobs", JobsSchema)

module.exports = JobModel