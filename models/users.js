let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    jobs: {
        type: [mongoose.Types.ObjectId], 
        ref: 'jobs',
        // required: true
    },
    date: {
      type: Date,
      default: Date.now,
    },
});

module.exports = mongoose.model('client', ClientSchema);