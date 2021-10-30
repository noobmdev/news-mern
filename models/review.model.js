const mongoose = require("mongoose");
const { ReviewStatus } = require("../constants");

const reviewSchema = mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "articles",
  },
  scores: {
    reievance: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
    },
    technicalContent: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
    },
    novelty: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
    },
    quality: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
    },
  },
  strongAspects: {
    type: String,
  },
  weakAspects: {
    type: String,
  },
  recommendedChanges: {
    type: String,
  },
  status: {
    type: String,
    enum: [...Object.values(ReviewStatus)],
    default: ReviewStatus.NEW_INVITATION,
  },
  submissionDate: {
    type: Number,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  reasonDecline: {
    type: String,
  },
});

reviewSchema.index({ reviewer: true, article: true }, { unique: true });

exports.Review = mongoose.model("reviews", reviewSchema);
