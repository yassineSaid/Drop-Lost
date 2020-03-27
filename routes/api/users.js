var express = require('express');
var router = require('express-promise-router')();
const UsersContoller = require('../../controllers/users');
const { validateBody, schemas } = require('../../helpers/routeHelpers');
const passport = require("passport");
const passportConf = require('../../passport');

/* GET users listing. */


router.route('/signup').post(validateBody(schemas.authSchema), UsersContoller.signUp);
router.route('/verify').post(UsersContoller.verify);
router.route('/oauth/facebook').post(passport.authenticate('facebookToken', { session: false }), UsersContoller.facebookOAuth);
router.route('/oauth/google').post(passport.authenticate('googleToken', { session: false }), UsersContoller.googleOAuth);
router.route('/signIn').post(validateBody(schemas.authSchema), passport.authenticate('local', { session: false }), UsersContoller.signIn);

router.route('/secret').get(passport.authenticate('jwt', { session: false }), UsersContoller.secret);

module.exports = router;
