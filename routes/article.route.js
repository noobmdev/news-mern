const articleRoute = require("express").Router();

const {
  create,
  get,
  edit,
  getOwner,
  getOne,
  updateArticleStatus,
  download,
  saveTmp,
  createReviews,
  getReviews,
  updateReview,
  inviteReview,
  editorAccept,
  publisherAccept,
  publishArticle,
  reject,
  deleteArticle,
  editorDecline,
} = require("../controllers/article.controller");
const { uploadFile } = require("../services/uploadFile");

const { isAuth } = require("../middlewares/isAuth");
const { hasRole } = require("../middlewares/hasRole");
const { ROLES } = require("../constants");
// const { ROLES } = require("../constants");

articleRoute
  .route("/")
  .post(
    isAuth,
    hasRole([ROLES.AUTHOR]),
    uploadFile.fields([
      {
        name: "file",
        maxCount: 1,
      },
      {
        name: "additionalFiles",
      },
    ]),
    create
  )
  .get(get);

articleRoute.route("/save").post(
  isAuth,
  hasRole([ROLES.AUTHOR]),
  uploadFile.fields([
    {
      name: "file",
      maxCount: 1,
    },
    {
      name: "additionalFiles",
    },
  ]),
  saveTmp
);

articleRoute.route("/roles/:role").get(isAuth, getOwner);

articleRoute
  .route("/:id")
  .get(getOne)
  .put(
    isAuth,
    hasRole([ROLES.AUTHOR]),
    uploadFile.fields([
      {
        name: "file",
        maxCount: 1,
      },
      {
        name: "additionalFiles",
      },
    ]),
    edit
  )
  .delete(isAuth, hasRole([ROLES.AUTHOR]), deleteArticle);

articleRoute
  .route("/:id/reviews")
  .get(isAuth, hasRole([ROLES.EDITOR]), getReviews)
  .post(isAuth, hasRole([ROLES.EDITOR]), createReviews);

articleRoute
  .route("/:id/invite")
  .post(isAuth, hasRole([ROLES.EDITOR_IN_CHIEF, ROLES.EDITOR]), inviteReview);

articleRoute
  .route("/:id/invite/editor")
  .get(isAuth, hasRole([ROLES.EDITOR]), editorAccept);

articleRoute
  .route("/:id/decline/editor")
  .get(isAuth, hasRole([ROLES.EDITOR]), editorDecline);

articleRoute
  .route("/:id/invite/publisher")
  .get(isAuth, hasRole([ROLES.PUBLISHER]), publisherAccept);

articleRoute
  .route("/:id/publish")
  .post(isAuth, hasRole([ROLES.PUBLISHER]), publishArticle);

articleRoute
  .route("/:id/reject")
  .put(isAuth, hasRole([ROLES.EDITOR_IN_CHIEF]), reject);

articleRoute
  .route("/:id/reviews/:reviewId")
  .put(isAuth, hasRole([ROLES.REVIEWER]), updateReview);

articleRoute.route("/:id/download").get(download);
// articleRoute.route("/test").get(isAuth, hasRole([ROLES.USER]), (req, res) => {
//   res.send("authenticated");
// });

articleRoute.route("/:id/status").put(isAuth, updateArticleStatus);

exports.articleRoute = articleRoute;
