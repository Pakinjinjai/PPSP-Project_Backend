const express = require('express');
const route = express.Router();
const { handleEvent,config } = require('../controllers/linecontroller');
const line = require('@line/bot-sdk')


route.post("/hook",line.middleware(config),(req,res)=>{
    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
})
module.exports = route;