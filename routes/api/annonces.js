const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const keys = require('../../config/default');
const User = require('../../models/user');
const AnnoncesController = require('../../controllers/annonces');
const passport = require("passport");

router.route('/ajouter').post(passport.authenticate('jwt', { session: false }), AnnoncesController.ajouterAnnonce);
router.route('/ajouterImages/:id').post(passport.authenticate('jwt', { session: false }), AnnoncesController.ajouterImages);
router.route('/match').post(passport.authenticate('jwt', { session: false }), AnnoncesController.matchAnnonce);
router.route('/mesAnnonces').get(passport.authenticate('jwt', { session: false }), AnnoncesController.mesAnnonces);
router.route('/annonce/:id').get(passport.authenticate(['jwt','anonymous'], { session: false }) ,AnnoncesController.getAnnonce);
router.route('/annoncesPerdus').get(AnnoncesController.getAnnoncesPerdus);

module.exports = router;