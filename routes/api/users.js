var express = require('express');
var router = require('express-promise-router')();
const UsersContoller = require('../../controllers/users');
const { validateBody, schemas } = require('../../helpers/routeHelpers');
const passport = require("passport");
const passportConf = require('../../passport');

/* GET users listing. */


router.route('/signup').post(validateBody(schemas.authSchema), UsersContoller.signUp);
router.route('/verify').post(UsersContoller.verify);
router.route('/forget').post(UsersContoller.forget);
router.route('/resetPassword').post(UsersContoller.resetPassword);
router.route('/superadmin/signIn').post(validateBody(schemas.SignInauthSchema), passport.authenticate('SUPERADMINLOGIN', { session: false }), UsersContoller.signIn);

router.route('/oauth/facebook').post( UsersContoller.facebookOAuth);
router.route('/oauth/google').post( UsersContoller.googleOAuth);
router.route('/signIn').post(validateBody(schemas.SignInauthSchema), passport.authenticate('local', { session: false }), UsersContoller.signIn);
router.route('/signout')
  .get(passport.authenticate('jwt', { session: false }), UsersContoller.signOut);
router.route('/secret').get(passport.authenticate('jwt', { session: false }), UsersContoller.secret);
router.route('/status').get(passport.authenticate('jwt', { session: false }), UsersContoller.checkAuth);
module.exports = router;
