const path = require("path");
const mongoose = require("mongoose");

const {
  ROLES,
  ArticleStatus,
  ReviewStatus,
  ConstantTypes,
  EditorChiefStatus,
  INVITE_ARTICLE,
  EditorStatus,
  EmailTypes,
  PublishStatus,
} = require("../constants");

const { Article, Review, Constant, User } = require("../models");
const { sendMail } = require("../services/sendMail");
const { buildPdf, removeFile } = require("../utils/buildPdf");

const generateManuscriptId = (manuscriptId) => {
  const _manuscriptId = manuscriptId.toString().padStart(4, "0");
  const year = new Date().getFullYear();
  return `JIST-${year}-${_manuscriptId}`;
};

exports.create = async (req, res) => {
  try {
    const file = req.files.file;
    const additionalFiles = req.files.additionalFiles ?? [];

    const {
      major,
      researches,
      isPosted,
      wherePosted,
      canShareManuscript,
      info,
    } = req.body;
    const _info = JSON.parse(info);

    let manuscriptId = await Constant.findOne({
      constantType: ConstantTypes.MANUSCRIPT_ID,
    });

    if (!manuscriptId) {
      manuscriptId = { value: 0 };
    }
    const _manuscriptId = Number(manuscriptId.value) + 1;
    const _generateManuscriptId = generateManuscriptId(_manuscriptId);

    await buildPdf({
      filename: file[0].filename,
      article: {
        ..._info,
        keywords: _info.keywords?.join("; ") ?? "",
        manuscriptId: _generateManuscriptId,
        author: _info?.authors?.find((a) => a?.id == req.user._id),
      },
    });

    const newArticle = new Article({
      manuscriptId: _generateManuscriptId,
      major,
      author: req.user._id,
      researches: JSON.parse(researches),
      isPosted: !!+isPosted,
      wherePosted,
      canShareManuscript: !!+canShareManuscript,
      file: {
        ...file[0],
        filename: `build_${file[0].filename}.pdf`,
      },
      additionalFiles,
      info: {
        ..._info,
        isPrize: !!+_info.isPrize,
      },
      status: ArticleStatus.WAIT_APPROVE,
    });

    await newArticle.save();
    await Constant.findOneAndUpdate(
      {
        constantType: ConstantTypes.MANUSCRIPT_ID,
      },
      {
        constantType: ConstantTypes.MANUSCRIPT_ID,
        value: _manuscriptId,
      },
      {
        upsert: true,
      }
    );

    res.json(newArticle);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.saveTmp = async (req, res) => {
  try {
    let data = {
      author: req.user._id,
      ...req.body,
    };
    if (req.files?.file) {
      data = {
        ...data,
        file: {
          ...req.files.file[0],
        },
      };
    }

    const additionalFiles = req.files?.additionalFiles ?? [];
    data = {
      ...data,
      additionalFiles,
    };

    if (req.body.info) {
      let _info = JSON.parse(req.body.info);
      data = {
        ...data,
        info: {
          ..._info,
          isPrize: !!+_info.isPrize,
        },
      };
    }
    if (req.body.researches) {
      data = {
        ...data,
        researches: JSON.parse(req.body.researches),
      };
    }

    let article;

    if (req.body.id) {
      article = await Article.findByIdAndUpdate(req.body.id, data, {
        new: true,
        upsert: true,
      });
    } else {
      article = new Article({
        ...data,
      });
      await article.save();
    }

    res.json(article);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.edit = async (req, res) => {
  try {
    const { id } = req.params;
    const articleExists = await Article.findById(id);

    const file = req.files.file;
    const additionalFiles = req.files.additionalFiles ?? [];

    const {
      type,
      researches,
      isPosted,
      wherePosted,
      canShareManuscript,
      info,
    } = req.body;
    const _info = JSON.parse(info);

    let manuscriptId = await Constant.findOne({
      constantType: ConstantTypes.MANUSCRIPT_ID,
    });

    if (!manuscriptId) {
      manuscriptId = { value: 0 };
    }
    const _manuscriptId = Number(manuscriptId.value) + 1;
    let _generateManuscriptId = generateManuscriptId(_manuscriptId);

    const articleExist = await Article.findById(id);
    if (articleExist.manuscriptId) {
      if (req.query.type) {
        const regex = /R[0-9]+$/gi;
        if (regex.test(articleExist.manuscriptId)) {
          const rebuildTime = articleExist.manuscriptId.match(/\d+$/)[0];
          const _rebuildTime = +rebuildTime + 1;
          _generateManuscriptId = articleExist.manuscriptId.replace(
            regex,
            `R${_rebuildTime}`
          );
        } else {
          _generateManuscriptId = `${articleExist.manuscriptId}-R1`;
        }
      } else {
        _generateManuscriptId = articleExist.manuscriptId;
      }
    } else {
      _generateManuscriptId = generateManuscriptId(_manuscriptId);
    }

    await buildPdf({
      filename: file[0].filename,
      article: {
        ..._info,
        keywords: _info.keywords?.join("; ") ?? "",
        manuscriptId: _generateManuscriptId,
        author: _info?.authors?.find((a) => a?.id == req.user._id),
      },
    });
    await Article.findByIdAndUpdate(id, {
      manuscriptId: _generateManuscriptId,
      type,
      author: req.user._id,
      researches: JSON.parse(researches),
      isPosted: !!+isPosted,
      wherePosted,
      canShareManuscript: !!+canShareManuscript,
      file: {
        ...file[0],
        filename: `build_${file[0].filename}.pdf`,
      },
      additionalFiles,
      info: {
        ..._info,
        isPrize: !!+_info.isPrize,
      },
      status: ArticleStatus.WAIT_APPROVE,
      statusDate: Date.now(),
    });
    await Constant.findOneAndUpdate(
      {
        constantType: ConstantTypes.MANUSCRIPT_ID,
      },
      {
        constantType: ConstantTypes.MANUSCRIPT_ID,
        value: _manuscriptId,
      },
      {
        upsert: true,
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.get = async (req, res) => {
  try {
    const type = req.query.type;
    const query = req.query.q;
    const issue = req.query.issue;

    let filter = type ? { status: type } : {};
    if (issue) {
      filter = { ...filter, issue: mongoose.Types.ObjectId(issue) };
    }
    if (query) {
      filter = {
        ...filter,
        $or: [
          {
            "info.title": { $regex: new RegExp(query, "gi") },
          },
          {
            "info.summary": { $regex: new RegExp(query, "gi") },
          },
          {
            "info.keywords": {
              $elemMatch: { $regex: new RegExp(query, "gi") },
            },
          },
          {
            "info.authors": {
              $elemMatch: {
                $or: [
                  {
                    firstname: { $regex: new RegExp(query, "gi") },
                  },
                  {
                    lastname: { $regex: new RegExp(query, "gi") },
                  },
                  {
                    email: { $regex: new RegExp(query, "gi") },
                  },
                ],
              },
            },
          },
        ],
      };
    }
    const articles = await Article.find({
      ...filter,
      status: ArticleStatus.ACCEPTED,
    })
      .populate("author", ["firstname", "lastname", "email"])
      .sort({ _id: -1 });
    res.json(articles);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.getLatest10 = async (req, res) => {
  try {
    const articles = await Article.find({
      status: ArticleStatus.ACCEPTED,
    })
      .populate("author", ["firstname", "lastname", "email"])
      .sort({ _id: -1 })
      .limit(10);
    res.json(articles);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(400).send("Invalid article");
    }
    if (article.author?.toString() != req.user._id.toString()) {
      return res.status(401).send("Unauthorized");
    }

    if (article.file?.filename) {
      await removeFile(article.file?.filename);
    }

    await article.remove();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.updateArticleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };
    if (req.body.status === ArticleStatus.WITH_EDITOR) {
      updateData = {
        ...updateData,
        submissionDate: Date.now(),
        editorInChiefStatus: EditorChiefStatus.NEW_SUBMISSIONS,
      };
    }
    const article = await Article.findByIdAndUpdate(
      id,
      {
        ...updateData,
        statusDate: Date.now(),
      },
      {
        new: true,
      }
    );
    res.json(article);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.getOwner = async (req, res) => {
  try {
    const { role } = req.params;
    if (req.user.role % role !== 0) {
      return res.status(401).send("Unauthorized");
    }
    // const type = req.query.type;
    // const filter = type ? { status: type } : {};
    let articles;

    switch (+role) {
      case ROLES.AUTHOR:
        articles = await Article.find({
          author: req.user._id,
        })
          .populate("author", ["firstname", "lastname", "email"])
          .sort({ createdAt: -1 });
        break;

      case ROLES.REVIEWER:
        articles = await Review.find({
          reviewer: req.user._id,
        })
          .populate("article")
          .populate("article.info")
          .populate("article.researches")
          .sort({ createdAt: -1 });
        break;

      case ROLES.EDITOR_IN_CHIEF:
        articles = await Article.find({
          status: {
            $nin: [ArticleStatus.INCOMPLETE, ArticleStatus.WAIT_APPROVE],
          },
        })
          .populate("author", ["firstname", "lastname", "email"])
          .sort({ createdAt: -1 });
        break;

      case ROLES.EDITOR:
        articles = await Article.find({
          editor: req.user._id,
          // editorStatus: { $nin: [EditorStatus.COMPLETED] },
        })
          .populate("author", ["firstname", "lastname", "email"])
          .sort({ createdAt: -1 });
        break;

      case ROLES.PUBLISHER:
        articles = await Article.find({
          // editorInChiefStatus: EditorChiefStatus.SENT_TO_PUBLISHER,
          publisher: req.user._id,
        })
          .populate("author", ["firstname", "lastname", "email"])
          .sort({ createdAt: -1 });
        break;

      default:
        return res.status(401).send("invalid role");
    }

    res.json(articles ?? []);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id)
      .populate("author", ["firstname", "lastname", "email"])
      .populate("volume", ["name"])
      .populate("issue", ["name"]);

    res.json(article);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.download = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    await Article.findByIdAndUpdate(id, {
      $inc: { totalDownload: 1 },
    });
    const { filename } = article.file;
    const pathFile = path.join("public", "files", `${filename}`);

    res.download(pathFile, filename, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
    // res.json(article);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.createReviews = async (req, res) => {
  try {
    const { id: articleId } = req.params;
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(401).send("Invalid articleId");
    }

    // TODO check article status
    if (article.status === ArticleStatus.WITH_EDITOR) {
      let { ids: userIds } = req.body;

      userIds = userIds.filter((id) => id !== article.author);

      if (!userIds?.length) {
        return res.status(400).send("Length of ids must be than 0");
      }

      await userIds.map((id) =>
        new Review({
          article: articleId,
          reviewer: id,
        }).save()
      );

      res.json({ success: true });
    } else {
      return res.status(400).send("Article has status can't have reviews");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { id: articleId } = req.params;
    const results = await Review.find({ article: articleId });
    res.json(results ?? []);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const UpdateReviewActions = {
  AcceptInvitation: "accept_invitation",
  DeclineInvitation: "decline_invitation",
  ApproveReview: "approve_review",
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const reviewExists = await Review.findById(reviewId);

    if (!reviewExists) {
      return res.status(401).send("Invalid reviewId");
    }

    const { type, data } = req.body;

    let updateData = { ...data };

    switch (type) {
      case UpdateReviewActions.AcceptInvitation:
        updateData = { ...updateData, status: ReviewStatus.INCOMPLETE };
        break;

      case UpdateReviewActions.DeclineInvitation:
        // updateData = { status: ReviewStatus.INCOMPLETE };
        // await Review.findByIdAndDelete(data.id);
        updateData = {
          ...updateData,
          status: ReviewStatus.REJECTED,
          isDeleted: true,
        };
        break;

      case UpdateReviewActions.ApproveReview:
        // updateData = { status: ReviewStatus.INCOMPLETE };
        // await Review.findByIdAndDelete(data.id);
        updateData = {
          ...updateData,
          status: ReviewStatus.COMPLETED,
          isCompleted: true,
          submissionDate: Date.now(),
        };

        const article = await Article.findById(reviewExists.article);
        if (!article?.editor) {
          return res.status(400).send("Article invalid, no editor");
        }
        const editor = await User.findById(article.editor);
        sendMail(editor.email, EmailTypes.REVIEWER_RESULT);

        break;

      default:
        break;
    }

    if (!updateData) {
      return res.status(400).send("Invalid update review type");
    }

    const review = await Review.findByIdAndUpdate(reviewId, updateData, {
      new: true,
    }).populate("article");

    res.json(review);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.inviteReview = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    const { type, to, data } = req.body;
    if (!to) {
      return res.status(400).send("Email receipts is required");
    }
    const { cc, ..._data } = data;
    const _cc = cc.split(";").filter((e) => !!e) ?? [];
    _cc.map((to) => sendMail(to, null, _data));

    const article = await Article.findById(articleId).populate("author", [
      "email",
    ]);

    if (!article) {
      return res.status(400).send("Invalid article");
    }

    switch (type) {
      case INVITE_ARTICLE.INVITE_EDITOR:
        const editor = await User.findOne({
          email: to,
          role: { $mod: [ROLES.EDITOR, 0] },
        });
        if (!editor) {
          return res.status(400).send("Email has not permission");
        }
        await Article.findByIdAndUpdate(articleId, {
          editor: editor._id,
          editorInChiefStatus: EditorChiefStatus.ASSIGNED_EDITOR,
          dateDecision: Date.now(),
          editorStatus: EditorStatus.NEW_INVITATION,
        });
        sendMail(editor.email, type, data);

        break;

      case INVITE_ARTICLE.INVITE_REVIEWER:
        const reviewer = await User.findOne({
          email: to,
          role: { $mod: [ROLES.REVIEWER, 0] },
        });
        if (!reviewer) {
          return res.status(400).send("Email has not permission");
        }

        const isExistReview = await Review.findOne({
          article: articleId,
          reviewer: reviewer._id,
        });
        if (isExistReview)
          return res.status(400).send("Reviewer already is invited to review");

        await new Review({
          article: articleId,
          reviewer: reviewer._id,
        }).save();
        sendMail(reviewer.email, type, data);
        break;

      case INVITE_ARTICLE.SEND_RESULT_TO_CHIEF:
        const editorChief = await User.findOne({
          role: { $mod: [ROLES.EDITOR_IN_CHIEF, 0] },
        });
        if (!editorChief) {
          return res.status(400).send("No Editor-in-Chief");
        }
        await Article.findByIdAndUpdate(articleId, {
          editorInChiefStatus: EditorChiefStatus.RESULT_EDITOR,
          editorStatus: EditorStatus.COMPLETED,
          dateDecision: Date.now(),
        });
        sendMail(editorChief.email, type);
        break;

      case INVITE_ARTICLE.SEND_TO_PUBLISHER:
        const publisher = await User.findOne({
          email: to,
          role: { $mod: [ROLES.PUBLISHER, 0] },
        });
        if (!publisher) {
          return res.status(400).send("Email has not permission");
        }

        await Article.findByIdAndUpdate(articleId, {
          publisher: publisher._id,
          editorInChiefStatus: EditorChiefStatus.SENT_TO_PUBLISHER,
          publisherStatus: PublishStatus.WAIT_FOR_PUBLISHING,
          dateDecision: Date.now(),
        });
        sendMail(publisher.email, type, data);
        break;

      case INVITE_ARTICLE.REVISION_AUTHOR:
        if (to?.toLowerCase().trim() !== article.author?.email) {
          return res.status(400).send("Invalid email of author");
        }
        await Article.findByIdAndUpdate(articleId, {
          status: ArticleStatus.NEED_REVISION,
          editorInChiefStatus: EditorChiefStatus.RETURN_AUTHOR,
        });
        article.author?.email && sendMail(article.author.email, type, data);
        break;

      default:
        break;
    }
    res.send("success");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.editorAccept = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    const article = await Article.findOne({
      _id: articleId,
      editor: req.user._id,
    }).populate("author", ["email"]);

    if (!article) {
      return res.status(400).send("Invalid article");
    }

    await Article.findByIdAndUpdate(articleId, {
      dateDecision: Date.now(),
      editorStatus: EditorStatus.INCOMPLETE_ASSIGNMENT,
    });

    // sendMail(editor.email, type, data)

    res.send("success");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.editorDecline = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    const article = await Article.findOne({
      _id: articleId,
      editor: req.user._id,
    }).populate("author", ["email"]);

    if (!article) {
      return res.status(400).send("Invalid article");
    }

    await Article.findByIdAndUpdate(articleId, {
      dateDecision: Date.now(),
      editorStatus: EditorStatus.DECLINE,
      editor: null,
    });

    // sendMail(editor.email, type, data)

    res.send("success");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.publisherAccept = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    const article = await Article.findOne({
      _id: articleId,
      publisher: req.user._id,
    }).populate("author", ["email"]);
    if (!article) {
      return res.status(400).send("Invalid article");
    }

    // await Article.findByIdAndUpdate(articleId, {
    //   dateDecision: Date.now(),
    //   editorStatus: EditorStatus.INCOMPLETE_ASSIGNMENT,
    // });

    // sendMail(editor.email, type, data)
    article.author?.email &&
      sendMail(article.author.email, EmailTypes.PUBLISHER_ACCEPT);

    res.send("success");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.publishArticle = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    const article = await Article.findOne({
      _id: articleId,
      publisher: req.user._id,
    }).populate("author", ["email", "_id"]);
    if (!article) {
      return res.status(400).send("Invalid article");
    }

    if (
      !req.body.publicationCode ||
      !article.file?.filename ||
      !Object.keys(article.info).length ||
      !article.author?._id
    ) {
      return res.status(400).send("Invalid article");
    }
    const _generateManuscriptId = generateManuscriptId(
      req.body.publicationCode
    );
    await buildPdf({
      filename: article.file.filename,
      article: {
        ...article.info,
        keywords: article.info.keywords?.join("; ") ?? "",
        manuscriptId: _generateManuscriptId,
        author: article.info?.authors?.find((a) => a?.id == article.author._id),
      },
      update: true,
    });

    await Article.findByIdAndUpdate(articleId, {
      dateDecision: Date.now(),
      manuscriptId: _generateManuscriptId,
      status: ArticleStatus.ACCEPTED,
      editorInChiefStatus: EditorChiefStatus.PUBLISHED,
      publisherStatus: PublishStatus.PUBLISHED,
      publishedDate: Date.now(),
      ...req.body,
    });

    article.author?.email &&
      sendMail(article.author.email, EmailTypes.PUBLISHED);

    res.send("success");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.reject = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    const article = await Article.findOne({
      _id: articleId,
    }).populate("author", ["email"]);
    if (!article) {
      return res.status(400).send("Invalid article");
    }

    await Article.findByIdAndUpdate(articleId, {
      dateDecision: Date.now(),
      status: ArticleStatus.REJECTED,
      editorInChiefStatus: EditorChiefStatus.REJECTED_DECISION,
    });

    article.author?.email &&
      sendMail(article.author.email, EmailTypes.REJECTED);

    res.send("success");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
