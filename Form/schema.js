const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  studentid: Number,
  name: String,
  address: String,
  avgr: Number,
  totalmarks: Number,
  gradeof: String,
});

const formModel = mongoose.model("records", formSchema);

module.exports = formModel;
