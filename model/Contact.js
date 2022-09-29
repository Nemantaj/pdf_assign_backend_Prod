const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    numbers: [{ num: { type: Number } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
