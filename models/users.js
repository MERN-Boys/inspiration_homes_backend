const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const UserSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },
  jobs: {
    type: [mongoose.Types.ObjectId], 
    ref: 'Job',
    // required: true
  },
})

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
})

module.exports = mongoose.model("User", UserSchema)

// 