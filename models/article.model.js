const mongoose = require("mongoose");
const {
  ArticleStatus,
  EditorChiefStatus,
  EditorStatus,
  PublishStatus,
} = require("../constants");

const articleSchema = mongoose.Schema({
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "majors_researches",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  manuscriptId: {
    type: String,
  },
  researches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "majors_researches",
    },
  ],
  file: {
    type: Object,
  },
  additionalFiles: [
    {
      type: Object,
    },
  ],
  isPosted: {
    type: Boolean,
  },
  wherePosted: {
    type: String,
  },
  canShareManuscript: {
    type: Boolean,
  },
  info: {
    title: {
      type: String,
    },
    summary: {
      type: String,
    },
    keywords: [
      {
        type: String,
      },
    ],
    authors: [
      {
        id: {
          type: String,
          default: "",
        },
        firstname: {
          type: String,
        },
        lastname: {
          type: String,
        },
        school: {
          type: String,
        },
        faculty: {
          type: String,
        },
        email: {
          type: String,
        },
      },
    ],
    isPrize: {
      type: Boolean,
    },
    prizeDetail: {
      type: String,
    },
  },
  status: {
    type: String,
    enum: [...Object.values(ArticleStatus)],
    default: ArticleStatus.INCOMPLETE,
  },
  editorInChiefStatus: {
    type: String,
  },
  editorStatus: {
    type: String,
    enum: [...Object.values(EditorStatus)],
  },
  publisherStatus: {
    type: String,
    enum: [...Object.values(PublishStatus)],
  },
  statusDate: {
    type: Number,
    default: Date.now(),
  },
  dateDecision: {
    type: Number,
  },
  publishedDate: {
    type: Number,
  },
  submissionDate: {
    type: Number,
  },
  editor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  publicationCode: {
    type: String,
  },
  pageNumberStart: {
    type: String,
  },
  pageNumberEnd: {
    type: String,
  },
  volume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "volumes_issues",
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "volumes_issues",
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  totalDownload: {
    type: Number,
    default: 0,
  },
});

exports.Article = mongoose.model("articles", articleSchema);
