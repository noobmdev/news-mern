const mongoose = require("mongoose");

const volumeIssueSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "volumes_issues",
  },
  desc: {
    type: String,
  },
  filename: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

exports.VolumeIssue = mongoose.model("volumes_issues", volumeIssueSchema);
