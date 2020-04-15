const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const keys = require('../../config/default');
const User = require('../../models/user');
const AnnoncesController = require('../../controllers/annonces');
const passport = require("passport");

router.route('/ajouter').post(passport.authenticate('jwt', { session: false }), AnnoncesController.ajouterAnnonce);
router.route('/match').post(passport.authenticate('jwt', { session: false }), AnnoncesController.matchAnnonce);
router.route('/mesAnnonces').post(passport.authenticate('jwt', { session: false }), AnnoncesController.mesAnnonces);

module.exports = router;