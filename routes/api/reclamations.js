var express = require('express');
var router = require('express-promise-router')();
const passport = require("passport");
const passportConf = require('../../passport');
let Reclamation=require('../../models/Reclamation')
const path = require("path");
const multer = require("multer");
const User = require('../../models/user');
const mongoose = require('mongoose');
const keys = require('../../config/default');
//The implementation of the Routes
const storage = multer.diskStorage({
    destination: "./public/uploadsReclamations/",
    filename: function (req, file, cb) {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).any();


router.route('/ajouterReclamation').post(function (req, res) {
    upload(req, res, (err) => {
        if (!err) {
            const reclamation = new Reclamation(JSON.parse(req.body.reclamation));
            var images = [];
            req.files.forEach(element => {
                images.push(element.filename)
            });
            reclamation.photo = JSON.stringify(images);
            reclamation.save().then(result => {
                res.status(201).json({ success: true });
            }).catch(err => {
                console.log(err);
        
                res.status(500).json({ success: false, errors: err });
            })
        }
        else {
            res.status(500).json({ success: false, errors: err });
        }
    })
});
router.get('/getAllReclamations' , (req,res) => {

    let user = mongoose.Types.ObjectId(req.query.userId);
    Reclamation.find({user:user})
        .then(reclamations => res.json(reclamations))
        .catch(err => res.status(400).json('Error' + err));
});
router.get('/getReclamations' , (req,res) => {
    Reclamation.find()
        .then(reclamations => res.json(reclamations))
        .catch(err => res.status(400).json('Error' + err));
});
router.get('/getReclamation/:id' , (req,res) => {

    // let user = mongoose.Types.ObjectId(req.query.userId);
    // const reclamation = await Reclamation.findById(req.params.id)
    //     .then(reclamation => res.json(reclamation))
    //     .catch(err => res.status(400).json('Error' + err));
});



router.route('/updateReclamation').put(function (req, res) {
    try {
 
        Reclamation.findById(req.body._id, function(err, reclam) {

    
                if(reclam!=null){
                reclam.description = req.body.description; 
                reclam.address=req.body.address,
                reclam.lng=req.body.lng,
                reclam.lat=req.body.lat
            }

            // save the reclamation
            reclam.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    }
    catch (err) {
        console.log(err)
 
        res.status(500).json({ success: false});
    }
    });

module.exports = router;