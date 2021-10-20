const { authRoute } = require("./auth.route");
const { listRoute } = require("./list.route");
const { articleRoute } = require("./article.route");

exports.setupRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/list", listRoute);
  app.use("/api/v1/articles", articleRoute);

  return app;
};
