const express = require("express");
const cors = require("cors");
require("./configs/database");
require("./broker");
require('dotenv').config();
const routes = require("./routes/routes");
const line = require('@line/bot-sdk');
const { config } = require("./controllers/linecontroller");
const main = async () => {
  const app = express();
  app.use(cors());
  app.use('/hook',line.middleware(config))
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const port = process.env.PORT || 3000;


  routes(app);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};


main().catch((e) => console.error(e));
