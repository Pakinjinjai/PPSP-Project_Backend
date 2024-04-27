const express = require('express');
const { addReply,getallReply } = require('../controllers/reply');
const { authorized } = require('../middleware/authorizations');

const route = express.Router();

 route.get('/getall-reply',getallReply);

route.post('/add-reply',addReply);

// route.patch('/:healthId',authorized,updateMeHealth);

// route.delete('/:healthId',authorized,deleteMeHealth);



module.exports = route;