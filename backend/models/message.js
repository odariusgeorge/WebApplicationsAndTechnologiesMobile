const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  content: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User" ,required: true},
  public:  {type: Boolean, required: true}
});

var Message = mongoose.model('Message', messageSchema);
module.exports.Message = Message
module.exports.MessageSchema = messageSchema
