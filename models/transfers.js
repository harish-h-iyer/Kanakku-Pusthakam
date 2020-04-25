var mongoose = require("mongoose");

var transferSchema = new mongoose.Schema({
    amount : Number,
    from : String,
    to : String
});

module.exports = mongoose.model("Transfer", transferSchema);
