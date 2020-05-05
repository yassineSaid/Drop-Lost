const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Match = require('../../models/Match');
const keys = require('../../config/default');

const verify = req => {
    if (req.cookies.access_token) {
        return req.cookies.access_token;
    }
    throw new Error;
};

router.post('/create', (req, res) => {

    let jwtUser = jwt.verify(verify(req), keys.jwtSecret);
    let trouve = mongoose.Types.ObjectId(req.body.trouve);
    let perdu = mongoose.Types.ObjectId(req.body.perdu);
    let etat = 'Attente de Rencontre';
    //console.log(req.body)
    let boutique = null;
    let code = null;
    if (req.body.methode === 'boutique') {
        etat = "Attente de Déposition"
        boutique = req.body.boutique,
        code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    }
    Match.findOneAndUpdate({
        annonces: {
            $all: [
                { $elemMatch: { $eq: trouve } },
                { $elemMatch: { $eq: perdu } },
            ],
        },
    }, {
        annonces: [trouve, perdu],
        methode: req.body.methode,
        code: req.body.code,
        boutique,
        date : Date.now(),
        code,
        etat
    },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, match) {
            if (err) {
                //console.log(err)
                res.setHeader('Content-Type', 'application/json');
                res.sendStatus(500);
                res.end(JSON.stringify({ message: 'Failure' }));
            }
            else {
                const message = {
                    message: "success",
                    match: match._id
                }
                res.send(message);
            }
        }
    );
});


router.get('/list', (req, res) => {
    let jwtUser = jwt.verify(verify(req), keys.jwtSecret);
    let user = mongoose.Types.ObjectId(jwtUser.sub);
    Match.aggregate([
        {
            '$lookup': {
                'from': 'annonces',
                'localField': 'annonces',
                'foreignField': '_id',
                'as': 'annonces'
            }
        }, {
            '$match': {
                'annonces': {
                    '$elemMatch': {
                        'user': {
                            '$eq': user
                        }
                    }
                }
            }
        }, {
            '$lookup': {
                'from': 'stores',
                'localField': 'boutique',
                'foreignField': '_id',
                'as': 'boutique'
            }
        }, {
            '$unwind': {
                'path': '$boutique'
            }
        }
    ]).exec((err, matchs) => {
        if (err) { }
        else {
            res.send(matchs);
        }
    })
})

router.get('/', (req, res) => {
    let jwtUser = jwt.verify(verify(req), keys.jwtSecret);
    //let user = mongoose.Types.ObjectId(jwtUser.sub);
    let annonce = mongoose.Types.ObjectId(req.query.match);
    Match.aggregate([
        {
          '$addFields': {
            'userId': {
              '$toString': '$_id'
            }
          }
        }, {
          '$match': {
            'userId': req.query.match
          }
        }, {
          '$lookup': {
            'from': 'stores', 
            'localField': 'boutique', 
            'foreignField': '_id', 
            'as': 'boutique'
          }
        }, {
          '$lookup': {
            'from': 'annonces', 
            'localField': 'annonces', 
            'foreignField': '_id', 
            'as': 'annonces'
          }
        }
      ]).exec((err, matchs) => {
        if (err) { }
        else {
            res.send(matchs);
        }
    })
})


module.exports = router;