const express = require('express');
const { authorized, isAdmin } = require('../middleware/authorizations');
const { addQueue, updateQueue, deleteQueue, getAllQueue, getQueuesByUser } = require('../controllers/queue');
const route = express.Router();

route.get("/me", authorized, getQueuesByUser);

route.get("/", authorized, isAdmin, getAllQueue);

route.post("/", authorized, isAdmin, addQueue);

route.patch("/:queueId", authorized, isAdmin, updateQueue);

route.delete("/:queueId", authorized, isAdmin, deleteQueue);

module.exports = route;