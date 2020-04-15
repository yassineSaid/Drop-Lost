const User = require('../models/user');
const Annonce = require('../models/annonce')
const getValidationErrors = require('../models/validationErrors')
module.exports = {
    ajouterAnnonce: async (req, res, next) => {
        //console.log(req.body)
        const annonce = new Annonce(req.body);
        if (!typeof req.user === 'undefined' && req.user === null)
            annonce.user = req.user._id;
        console.log(annonce)
        try {
            const result = await annonce.save();
            console.log(result);
            res.status(201).json({ success: true, result: result });

        } catch (err) {
            var errors = getValidationErrors(err.errors)
            console.error(errors)
            res.status(500).json({ success: false, errors: errors });
            //const validation = new ValidationErrors(err)
            //console.log(validation)
        }
    },
    matchAnnonce: async (req, res, next) => {
        console.log(req.body)
        const annonce = await Annonce.findById(req.body.id);
        if (annonce) {
            var query = {}
            if (annonce.trouve) {
                query.trouve = false
                query.date = {
                    $lte: annonce.date
                }
            } else {
                query.trouve = false
                query.date = {
                    $gte: annonce.date
                }
            }
            if ("objet" in annonce) {
                query["objet.categorie"] = annonce.objet.categorie
                query["objet.sousCategorie"] = annonce.objet.sousCategorie
                query["objet.marque"] = annonce.objet.marque
                query["objet.modele"] = annonce.objet.modele
            }
            const annonces = await Annonce.find(query).then(annonces => {
                console.log(annonces)
                res.status(200).json({ success: true, annonces: annonces })
            })
        }
    },
    mesAnnonces: async (req, res, next) => {
        try {
            const annonces = await Annonce.find({ "user": req.user._id }).sort('date')
            res.status(200).json({ success: true, errors: annonces });
        }
        catch (err) {
            console.log(error)
            res.status(500).json({ success: false, errors: err });
        }
    }
}