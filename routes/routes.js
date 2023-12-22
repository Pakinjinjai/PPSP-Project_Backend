const userRoute = require("./users");
const healthRoute = require("./health");
const queueRoute = require("./queue");

module.exports = (app) => {
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/healths", healthRoute);
  app.use("/api/v1/queues", queueRoute);
};
