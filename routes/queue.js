const express = require('express');
const { authorized, isAdmin } = require('../middleware/authorizations');
const { addQueue, updateQueue, deleteQueue, getAllQueue, getQueuesByUser } = require('../controllers/queue');
const route = express.Router();

route.get("/me", authorized, getQueuesByUser);

route.get("/get-all", authorized, isAdmin, getAllQueue);

route.post("/add", authorized, isAdmin, addQueue);

route.patch("/update/:queueId", authorized, isAdmin, updateQueue);

route.delete("/:queueId", authorized, isAdmin, deleteQueue);

module.exports = route;