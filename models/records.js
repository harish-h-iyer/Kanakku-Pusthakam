var mongoose = require("mongoose");

var recordSchema = new mongoose.Schema({
      date: String,
      paid: String,
      from: String,
      paidto: String,
      cash: String,
      axis: String,
      hsbc:String,
      sbi: String
});

module.exports = mongoose.model("Record", recordSchema);
