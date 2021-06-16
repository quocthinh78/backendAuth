const express = require('express')
const cors = require('cors')
    // const router = express.Router()
const router = require('express-promise-router')();
const { validateParams, schemas, validateBody } = require('../helper/routerHelper')
const userController = require("../controllers/user");
const passport = require("passport");
const passportConfig = require('../middleware/passport');

router.route("/")
    .get(userController.getAllUser)
    .post(validateBody(schemas.userSchema), userController.createUser)
router.route("/auth/google")
    .post(passport.authenticate('google-plus-token', { session: false }), userController.authGoogle)
router.route("/auth/facebook")
    .post(passport.authenticate('facebook-token', { session: false }), userController.authFaceBook)
router.route('/:userId')
    .get(validateParams(schemas.idSchema, "userId"), userController.getUser)
    .put(userController.replaceUser)
    .patch(validateParams(schemas.idSchema, "userId"), validateBody(schemas.userOptionalSchema), userController.updateUsre)
router.route("/:userId/decks")
    .get(userController.getUserDeck)
    .post(userController.newUserDeck)
router.route('/signIn')
    .post(passport.authenticate("local", { session: false }), cors(), userController.signIn)
router.route('/signUp')
    .post(userController.signUp)
router.route("/secret")
    .post(passport.authenticate("jwt", { session: false }), userController.secret)
module.exports = router;