if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const passport = require("passport");
const cors = require("cors");
const morgan = require("morgan");

const { setupRoutes } = require("./routes/index");
const { connectDB } = require("./config/mongoose");
const { passportConfig } = require("./config/passport");

const main = async () => {
  const app = express();

  // connect to DB
  await connectDB();

  // middlewares
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.static(path.join(__dirname, "client/build")));
  app.use(cors());
  app.use(passport.initialize());
  app.use(passport.session());

  // passport config
  passportConfig(passport);

  // setup routes
  setupRoutes(app);

  // app.get("/*", (req, res) => {
  //   res.sendFile(path.join(__dirname, "client/build", "index.html"));
  // });

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
};

main().catch((err) => {
  console.log(err);
});
