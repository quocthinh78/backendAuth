const express = require('express')

// const router = express.Router()
const router = require('express-promise-router')();
const { validateParams, schemas, validateBody } = require('../helper/routerHelper')
const deckController = require("../controllers/deck")
router.route("/")
    .get(deckController.getAllDeck)
    .post(deckController.createDeck)
router.route('/:deckId')
    .get(deckController.getDeck)
    .put(deckController.replaceDeck)
    .patch(deckController.updateDeck)
    .delete(deckController.deleteDeck)
module.exports = router;