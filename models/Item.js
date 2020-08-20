const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ItemSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  productCode: {
    type: String,
    required: true
  },
  productName: {
      type: String,
      required: true
  },
  lastEmailed: {
    type: Date,
    required: true
  }
});
module.exports = Item = mongoose.model("items", ItemSchema);