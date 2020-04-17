const User = require('../models/user');
const Annonce = require('../models/annonce')
const getValidationErrors = require('../models/validationErrors')
module.exports = {
    ajouterAnnonce: async (req, res, next) => {
        //console.log(req.body)
        const annonce = new Annonce(req.body);
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
        const annonces = getMatchedAnnonces(req.body.id).then(annonces => {
            res.status(200).json({ success: true, annonces: annonces })
        })
    },
    mesAnnonces: async (req, res, next) => {
        try {
            const annonces = await Annonce.find({ "user": req.user._id }).sort('date')
            console.log(req.user._id)
            res.status(200).json({ success: true, annonces: annonces });
        }
        catch (err) {
            console.log(error)
            res.status(500).json({ success: false, errors: err });
        }
    },
    getAnnonce: async (req, res, next) => {
        try {
            console.log("User: " + req.user)
            const annonce = await Annonce.findById(req.params.id)
            var response = { success: true, annonce: annonce, matched: false, annonces: [] }
            const annonces = await getMatchedAnnonces(req.params.id, req.user).then(
                annonces => {
                    console.log(annonces)
                    response = {
                        ...response,
                        matched: true,
                        annonces: annonces
                    }
                    res.status(200).json(response);
                },
                error => {
                    res.status(200).json(response);
                }
            )
                .catch(error => {
                    res.status(200).json(response);
                })
            //console.log(response)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errors: err });
        }
    }
}
async function getMatchedAnnonces(id, user) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAa")
    const annonce = await Annonce.findById(id);
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAa")
    let promise = new Promise(function (resolve, reject) {
        if (typeof user === "undefined") {
            reject(new Error("Vous devez être connecté"))
        }
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
            Annonce.find(query).then(annonces => {
                console.log(annonces)
                resolve(annonces)
            })
        }
        else {
            reject(new Error("Cette annonce n'éxiste pas"))
        }
    })
    return promise;

}