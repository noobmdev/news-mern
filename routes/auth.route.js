const authRoute = require("express").Router();

const {
  postRegister,
  postLogin,
  getUsers,
  updateUser,
} = require("../controllers/auth.controller");

const { isAuth } = require("../middlewares/isAuth");
const { hasRole } = require("../middlewares/hasRole");
const { ROLES } = require("../constants");

authRoute.route("/register").post(postRegister);
authRoute.route("/login").post(postLogin);
authRoute.route("/test").get(isAuth, hasRole([ROLES.USER]), (req, res) => {
  res.send("authenticated");
});

authRoute.route("/users").get(isAuth, hasRole([ROLES.ADMIN]), getUsers);

authRoute.route("/users/:id").put(isAuth, updateUser);

exports.authRoute = authRoute;