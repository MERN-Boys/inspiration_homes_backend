const stages = () => {
    return [
        {
            index: 0,
            name: "Pending",
            status: "InProgress",
            owed: 0,
            paid: 0,
            pictures: [],
            comments: []
        },
        {
            index: 1,
            name: "Ground Works",
            status: "Hidden",
            owed: 0,
            paid: 0,
            pictures: [],
            comments: []
        },
        {
            index: 2,
            name: "Base",
            status: "Hidden",
            owed: 0,
            paid: 0,
            pictures: [],
            comments: []
        },
        {
            index: 3,
            name: "Frame",
            status: "Hidden",
            owed: 0,
            paid: 0,
            pictures: [],
            comments: []
        },
        {
            index: 4,
            name: "Lockup/Enclosed",
            status: "Hidden",
            owed: 0,
            paid: 0,
            pictures: [],
            comments: []
        },
        {
            index: 5,
            name: "Fixing/Fit Off",
            status: "Hidden",
            owed: 0,
            paid: 0,
            pictures: [],
            comments: []
        },
        {
            index: 6,
            name: "PCI",
            status: "Hidden",
            owed: 0,
            paid: 0,
            pictures: [],
            comments: []
        },
        {
            index: 7,
            name: "Handover",
            status: "Hidden",
            owed: 0,
            paid: 0,
            pictures: [],
            comments: []
        }
    ]
}

module.exports = stages;

// stages: [{
//     index:  Number,
//     name: String,
//     status: String,
//     owed: Number,
//     paid: Number,
//     pictures: [String],
//     comments: [{
//         commenterId: mongoose.ObjectId,
//         comment: String
//     }]
// }]

// Hidden/InProgress/PaymentPending/Complete