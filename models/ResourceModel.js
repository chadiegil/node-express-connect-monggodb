const mongoose = require("mongoose");

// defining schema
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  title: { type: String },
  description: { type: String },
  map: { type: String },
  url: { type: String },
});

module.exports = mongoose.model("Resource", ResourceSchema);
