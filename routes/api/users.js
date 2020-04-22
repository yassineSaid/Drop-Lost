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

router.route('/superadmin/addadmin').post(validateBody(schemas.authSchema), UsersContoller.addAdmin);
router.route('/superadmin/alladmins').get(UsersContoller.allAdmins);
router.route('/superadmin/allusers').get(UsersContoller.allUsers);
router.route('/superadmin/makeUser').post(UsersContoller.makeUser);
router.route('/superadmin/makeAdmin').post(UsersContoller.makeAdmin);

router.route('/admin/ban').post(UsersContoller.banUser);
router.route('/admin/unban').post(UsersContoller.unbanUser);
router.route('/admin/addagent').post(UsersContoller.addAgent);
router.route('/admin/allagents').get(UsersContoller.allAgents);

router.route('/agent/addstore').post(UsersContoller.addStore);

router.route('/agent/addobjecttostore').post(UsersContoller.addObjectToStore);
router.route('/agent/deleteobjectfromstore').post(UsersContoller.deleteObjectfromStore);
router.route('/agent/liststores').get(UsersContoller.liststores);
router.route('/agent/listobjectinstore/:nom').get(UsersContoller.listobjectsinstore);

router.route('/oauth/facebook').post(UsersContoller.facebookOAuth);
router.route('/oauth/google').post(UsersContoller.googleOAuth);
router.route('/signIn').post(validateBody(schemas.SignInauthSchema), passport.authenticate('local', { session: false }), UsersContoller.signIn);
router.route('/signout')
  .get(passport.authenticate('jwt', { session: false }), UsersContoller.signOut);
router.route('/secret').get(passport.authenticate('jwt', { session: false }), UsersContoller.secret);
router.route('/status').get(passport.authenticate('jwt', { session: false }), UsersContoller.checkAuth);
module.exports = router;
