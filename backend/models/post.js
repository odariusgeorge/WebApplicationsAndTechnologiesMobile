const mongoose = require('mongoose');

var MessageSchema = require('./message').MessageSchema

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, require: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User" ,required: true},
  course: {type: String, required: true},
  university: {type: String, required: true},
  author: {type: String, required: true},
  messages: [[MessageSchema]],
  startingPrice: {type: Number, required: true},
  minimumAllowedPrice: {type: Number, required: true},
  winner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  date: {type: Date, required: true},
  bought: {type: Boolean, required: true},
  bidders: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
});

module.exports = mongoose.model('Post', postSchema);
