const express = require('express');
const { getMeHealth, addMeHealth, updateMeHealth, deleteMeHealth } = require('../controllers/health');
const { authorized } = require('../middleware/authorizations');

const route = express.Router();

route.get('/',authorized,getMeHealth);

route.post('/',authorized,addMeHealth);

route.patch('/:healthId',authorized,updateMeHealth);

route.delete('/:healthId',authorized,deleteMeHealth);



module.exports = route;