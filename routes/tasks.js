const express = require('express')

// const router = express.Router()
const router = require('express-promise-router')();
const { validateParams, schemas, validateBody } = require('../helper/routerHelper')
const TaskController = require("../controllers/task")
router.route("/")
    .get(TaskController.getTask)
    .post(TaskController.createTask)
router.route("/author")
    .get(TaskController.getAuthor)
router.route('/project')
    .get(TaskController.getProject)
router.route('/:id')
    .delete(TaskController.deleteTask)
    .get(TaskController.getFirstData)
    .put(TaskController.updateTask)
module.exports = router;