const mongoose = require("mongoose");

const { ROLES } = require("../constants");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  phone: {
    type: String,
  },
  postcode: {
    type: String,
  },
  country: {
    type: String,
  },
  city_provine: {
    type: String,
  },
  address: {
    type: String,
  },
  university: {
    type: String,
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "majors_researches",
  },
  research: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "majors_researches",
  },
  role: {
    type: Number,
    default: ROLES.AUTHOR * ROLES.REVIEWER,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

exports.User = mongoose.model("users", userSchema);
