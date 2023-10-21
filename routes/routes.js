const userRoute = require('./users');
const profileRoute = require('./profile_patient');
const healthRoute = require('./health');
const queueRoute = require('./queue');


module.exports = (app) => {
    app.use("/api/v1/users", userRoute);
    app.use("/api/v1/profile", profileRoute);
    app.use("/api/v1/healths", healthRoute);
    app.use("/api/v1/queues", queueRoute);
};