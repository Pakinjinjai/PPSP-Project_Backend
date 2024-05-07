const express = require('express');
const router = express.Router();
const { handleEvent,config } = require('../controllers/linecontroller');
const line = require('@line/bot-sdk')


router.post("/hook",(req,res)=>{ 
    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
})
module.exports = router;