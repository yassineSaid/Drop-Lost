const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const keys = require('../../config/default');
const User = require('../../models/user');
const AnnoncesController = require('../../controllers/annonces');

router.route('/ajouter').post(AnnoncesController.ajouterAnnonce);

module.exports = router;