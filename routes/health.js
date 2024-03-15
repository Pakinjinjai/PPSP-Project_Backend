const express = require('express');
const { getMeHealth, addMeHealth, updateMeHealth, deleteMeHealth } = require('../controllers/health');
const { authorized } = require('../middleware/authorizations');

const route = express.Router();

route.get('/me',authorized,getMeHealth);

route.post('/addme',authorized,addMeHealth);

route.patch('/:healthId',authorized,updateMeHealth);

route.delete('/:healthId',authorized,deleteMeHealth);



module.exports = route;