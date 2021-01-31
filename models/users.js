const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const passport = require("passport")

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
  role: {
    type: String,
    default: 'Client'
  }
})

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
})

module.exports = mongoose.model("User", UserSchema)

// 