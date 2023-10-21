const express = require('express');
const route = express.Router();
const { getProfile, updateProfile, deleteProfile, getProfileById } = require('../controllers/profile_patient');
const { authorized } = require('../middleware/authorizations');

route.get('/',authorized,getProfile);

route.get('/:userId',authorized,getProfileById);

route.patch('/',authorized,updateProfile);

route.delete('/',authorized,deleteProfile);

module.exports = route;