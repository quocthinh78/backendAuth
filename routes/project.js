const express = require('express')

// const router = express.Router()
const router = require('express-promise-router')();
const { validateParams, schemas, validateBody } = require('../helper/routerHelper')
const ProjectController = require("../controllers/project")
router.route("/")
    .get(ProjectController.getProject)
    .post(ProjectController.createProject)
router.route("/:id")
    .delete(ProjectController.deleteProject)
module.exports = router;