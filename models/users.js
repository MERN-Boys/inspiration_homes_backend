const mongoose = require("mongoose")

//get passport local mongoose strategy
const passportLocalMongoose = require("passport-local-mongoose")

//define user model structure
const UserSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },
  jobs: {
    type: [mongoose.Types.ObjectId], 
    ref: 'Job',
  },
  role: {
    type: String,
    default: 'Client'
  }
})

//adds passport functionality to user model, and changes username field to 'email'
UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
})

//export model
module.exports = mongoose.model("User", UserSchema)