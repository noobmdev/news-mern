const mongoose = require("mongoose");
const { ConstantTypes } = require("../constants");

const constantSchema = mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  constantType: {
    type: String,
    enum: [...Object.values(ConstantTypes)],
    unique: true,
    required: true,
  },
});

exports.Constant = mongoose.model("constants", constantSchema);
