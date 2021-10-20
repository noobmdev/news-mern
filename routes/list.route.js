const listRoute = require("express").Router();

const {
  create,
  get,
  remove,
  update,
} = require("../controllers/list.controller");

const { isAuth } = require("../middlewares/isAuth");
const { hasRole } = require("../middlewares/hasRole");
const { ROLES } = require("../constants");

listRoute
  .route("/")
  .get(get)
  .post(isAuth, hasRole([ROLES.ADMIN]), create)
  .put(isAuth, hasRole([ROLES.ADMIN]), update)
  .delete(isAuth, hasRole([ROLES.ADMIN]), remove);
// listRoute.route("/login").post(postLogin);
// listRoute.route("/test").get(isAuth, hasRole([ROLES.USER]), (req, res) => {
//   res.send("authenticated");
// });

exports.listRoute = listRoute;
