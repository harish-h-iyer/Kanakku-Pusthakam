var mongoose = require("mongoose");

var balanceSchema = new mongoose.Schema({
    id: String,
   cash: Number,
   axis: Number,
   hsbc: Number,
   sbi: Number
});

module.exports = mongoose.model("Balance", balanceSchema);
