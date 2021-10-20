const mongoose = require("mongoose");

const majorResearchSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "majors_researches",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

exports.MajorResearch = mongoose.model(
  "majors_researches",
  majorResearchSchema
);
