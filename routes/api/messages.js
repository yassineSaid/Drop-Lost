const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const keys = require('../../config/default');
const User = require('../../models/user');
const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const Store = require('../../models/store');
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: "./public/uploads/chat/",
    filename: function (req, file, cb) {
        cb(null, "img-" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage })
//verify token
const verify = req => {

    
    if (req.cookies.access_token) {
        return req.cookies.access_token;
    }
    throw new Error;
};

/*let jwtUser = null;
// Token verfication middleware
router.use(function(req, res, next) {
    try {
        
        jwtUser = jwt.verify(verify(req), keys.jwtSecret);
        next();
    } catch (err) {
        //console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        res.sendStatus(401);
    }
});*/



//get users list to interact with for the logged in user
router.get('/users', (req, res) => {
    try {

        let jwtUser = jwt.verify(verify(req), keys.jwtSecret);
        let id = mongoose.Types.ObjectId(jwtUser.sub);
        User.aggregate()
            .match({ _id: { $not: { $eq: id } } })
            .project({
                local: {
                    password: 0,
                    secretToken: 0,
                    Isactive: 0
                },
                method: 0,
                __v: 0,
            })
            .exec((err, users) => {
                if (err) {
                    //console.log(err);
                    res.setHeader('Content-Type', 'application/json');
                    res.sendStatus(500);
                    res.end(JSON.stringify({ message: 'Failure' }));
                } else {
                    const usersf = users.map(user => {
                        return ({
                            ...user,
                            thumb: "https://via.placeholder.com/150x150",
                            status: "away",
                            matchedOn: "Object lost or found",
                        })
                    })
                    res.send(usersf);
                }
            });
    } catch (err) {
        //console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.sendStatus(401);
        res.end(JSON.stringify({ message: 'Unauthorized' }));

    }
});

//get conversation list of connected user
router.get('/conversations', (req, res) => {
    let jwtUser = jwt.verify(verify(req), keys.jwtSecret);
    let from = mongoose.Types.ObjectId(jwtUser.sub);
    Conversation.aggregate([
        {
            $match: {
                recipients: {
                    $elemMatch: {
                        $eq: from
                    }
                }
            }
        }, {
            $unwind: {
                path: "$recipients"
            }
        }, {
            $match: {
                recipients: {
                    $not: {
                        $eq: from
                    }
                }
            }
        },
        {
            '$lookup': {
              'from': 'annonces', 
              'localField': 'annonce', 
              'foreignField': '_id', 
              'as': 'annonce'
            }
          },{
            '$lookup': {
              'from': 'annonces', 
              'localField': 'matchAnnonce', 
              'foreignField': '_id', 
              'as': 'matchAnnonce'
            }
          }
        , {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj'
            }
        }, {
            $unwind: {
                path: '$recipientObj'
            }
        },
        {
            $sort: {
                date: -1
            }
        }
    ]).project({
        '__v': 0,
        'recipients': 0,
        'recipientObj.method': 0,
        'recipientObj.__v': 0,
        'recipientObj.password': 0,
        'recipientObj.Isactive': 0,
        'recipientObj.secretToken': 0,
    })
        .exec((err, conversations) => {
            if (err) {
                //console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.sendStatus(500);
                res.end(JSON.stringify({ message: 'Failure' }));
            } else {
                const conversationsf = conversations.map(user => {
                    return ({
                        ...user,
                        thumb: "https://via.placeholder.com/150x150",
                        status: "away",
                    })
                })
                res.send(conversationsf);
            }
        });
});

// Post private message
router.post('/', (req, res) => {
    let jwtUser = jwt.verify(verify(req), keys.jwtSecret);
    let from = mongoose.Types.ObjectId(jwtUser.sub);
    let to = mongoose.Types.ObjectId(req.body.to);
    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [jwtUser.sub, req.body.to],
            lastMessage: req.body.body,
            date: Date.now(),
            from: from
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, conversation) {
            if (err) {
                //console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.sendStatus(500);
                res.end(JSON.stringify({ message: 'Failure' }));

            } else {
                let message = new Message({
                    conversation: conversation._id,
                    to: req.body.to,
                    from: jwtUser.sub,
                    body: req.body.body,
                });



                message.save(err => {
                    if (err) {
                        //console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.sendStatus(500);
                        res.end(JSON.stringify({ message: 'Failure' }));
                    } else {
                        const msg = {
                            conversation: conversation._id,
                            to: req.body.to,
                            from: jwtUser.sub,
                            body: req.body.body,
                            date: Math.floor(new Date() / 1000),
                            message : 'texte'
                        }
                        global.io.to(conversation._id).emit('message', msg);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(
                            JSON.stringify({
                                message: 'Success',
                                conversationId: conversation._id,
                            })
                        );
                    }
                });
            }
        }
    );
});

// Get messages from conversation
// based on to & from
router.get('/conversations/query', (req, res) => {
    let jwtUser = jwt.verify(verify(req), keys.jwtSecret);
    let user1 = mongoose.Types.ObjectId(jwtUser.sub);
    let user2 = mongoose.Types.ObjectId(req.query.userId);
    Message.aggregate([
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
        })
        .project({
            '__v': 0,
        })
        .exec((err, messages) => {
            if (err) {
                //console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.sendStatus(500);
                res.end(JSON.stringify({ message: 'Failure' }));
            } else {
                res.send(messages);
            }
        });
});


router.post('/create', (req, res) => {
    let jwtUser = jwt.verify(verify(req), keys.jwtSecret);
    let from = mongoose.Types.ObjectId(jwtUser.sub);
    let to = mongoose.Types.ObjectId(req.body.to);
    let annonce = mongoose.Types.ObjectId(req.body.annonce);
    let matchAnnonce = mongoose.Types.ObjectId(req.body.matchAnnonce);
    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [jwtUser.sub, req.body.to],
            lastMessage: "",
            date: Date.now(),
            from: from,
            annonce,
            matchAnnonce
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, conversation) {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.sendStatus(500);
                res.end(JSON.stringify({ message: 'Failure' }));

            } else {
                res.setHeader('Content-Type', 'application/json');
                Conversation.aggregate([
                    {
                      '$lookup': {
                        'from': 'users', 
                        'localField': 'recipients', 
                        'foreignField': '_id', 
                        'as': 'recipients'
                      }
                    }, {
                      '$lookup': {
                        'from': 'annonces', 
                        'localField': 'annonce', 
                        'foreignField': '_id', 
                        'as': 'annonce'
                      }
                    },
                    {
                        '$lookup': {
                          'from': 'annonces', 
                          'localField': 'matchAnnonce', 
                          'foreignField': '_id', 
                          'as': 'annonce'
                        }
                      }
                  ]).exec((err, conver) => {
                    res.end(JSON.stringify({ message: 'Success',conversation: conver}));
                  })
                
            }
        }
    );
});


router.post('/upload',upload.single('image'), (req, res) => {

    
    let jwtUser = jwt.verify(verify(req), keys.jwtSecret);
    let from = mongoose.Types.ObjectId(jwtUser.sub);
    let to = mongoose.Types.ObjectId(req.body.to);
    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [jwtUser.sub, req.body.to],
            lastMessage: req.file.filename,
            date: Date.now(),
            from: from
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, conversation) {
            if (err) {
                //console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.sendStatus(500);
                res.end(JSON.stringify({ message: 'Failure' }));

            } else {
                let message = new Message({
                    conversation: conversation._id,
                    to: req.body.to,
                    from: jwtUser.sub,
                    body: req.file.filename,
                    message: 'image'
                });

                message.save(err => {
                    if (err) {
                        //console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.sendStatus(500);
                        res.end(JSON.stringify({ message: 'Failure' }));
                    } else {
                        const msg = {
                            conversation: conversation._id,
                            to: req.body.to,
                            from: jwtUser.sub,
                            body: req.file.filename,
                            date: Math.floor(new Date() / 1000),
                            message : 'image'
                        }
                        global.io.to(conversation._id).emit('message', msg);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(
                            JSON.stringify({
                                message: 'Success',
                                conversationId: conversation._id,
                                image : req.file.filename,
                            })
                        );
                    }
                });
            }
        }
    );
});

router.get('/store', (req, res) => {
    //let user2 = mongoose.Types.ObjectId(req.query.params);
    console.log(req.query);
    Store.aggregate([
        {
          '$geoNear': {
            'near': {
              'type': 'Point', 
              'coordinates': [ parseFloat(req.query.lat), parseFloat(req.query.lon) ]
            }, 
            'distanceField': 'distance'
          }
        }, {
          '$limit': 1
        }
      ]).exec((err, stores) => {
            if (err) {
                //console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.sendStatus(500);
                res.end(JSON.stringify({ message: 'Failure' }));
            } else {
                res.send(stores);
            }
        });
});

module.exports = router;