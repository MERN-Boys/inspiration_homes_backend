let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    name: String
});

module.exports = mongoose.model('client', ClientSchema);