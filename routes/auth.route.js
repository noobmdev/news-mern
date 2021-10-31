const authRoute = require("express").Router();

const {
  postRegister,
  postLogin,
  getUsers,
  updateUser,
  forgotPassword,
  updateProfile,
} = require("../controllers/auth.controller");

const { isAuth } = require("../middlewares/isAuth");
const { hasRole } = require("../middlewares/hasRole");
const { ROLES } = require("../constants");

authRoute.route("/register").post(postRegister);
authRoute.route("/login").post(postLogin);
authRoute.route("/forgot-password").post(forgotPassword);

authRoute
  .route("/users")
  .get(isAuth, hasRole([ROLES.ADMIN]), getUsers)
  .put(isAuth, updateProfile);

authRoute.route("/users/:id").put(isAuth, updateUser);

exports.authRoute = authRoute;
