const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const keys = require('../../config/default');
const User = require('../../models/user');
const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');


//verify token
const verify = req => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    )
        return req.headers.authorization.split(' ')[1];
    return null;
};

let jwtUser = null;
// Token verfication middleware
router.use(function(req, res, next) {
    try {
        jwtUser = jwt.verify(verify(req), keys.jwtSecret);
        next();
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        res.sendStatus(401);
    }
});



//get users list to interact with for the logged in user
router.get('/users', (req, res) => {
    try {
        let jwtUser = jwt.verify(verify(req), keys.jwtSecret);
        let id = mongoose.Types.ObjectId(jwtUser.sub);

        User.aggregate()
            .match({ _id: { $not: { $eq: id } } })
            .project({
                local : {
                    password: 0,
                    secretToken: 0,
                    Isactive : 0
                },
                method: 0,
                __v: 0,
            })
            .exec((err, users) => {
                if (err) {
                    console.log(err);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Failure' }));
                    res.sendStatus(500);
                } else {
                    res.send(users);
                }
            });
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        res.sendStatus(401);
    }
});

//get conversation list of connected user
router.get('/conversations', (req, res) => {
    let from = mongoose.Types.ObjectId(jwtUser.sub);
    Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
        .project({
            'recipientObj.method': 0,
            'recipientObj.__v': 0,
            'recipientObj.local.password': 0,
            'recipientObj.local.Isactive': 0,
            'recipientObj.local.secretToken': 0,
        })
        .exec((err, conversations) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(conversations);
            }
        });
});

// Post private message
router.post('/', (req, res) => {

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
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function(err, conversation) {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                let message = new Message({
                    conversation: conversation._id,
                    to: req.body.to,
                    from: jwtUser.sub,
                    body: req.body.body,
                });

                

                message.save(err => {
                    if (err) {
                        console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Failure' }));
                        res.sendStatus(500);
                    } else {
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
    let user1 = mongoose.Types.ObjectId(jwtUser.sub);
    let user2 = mongoose.Types.ObjectId(req.query.userId);
    Message.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
        })
        .project({
            'toObj.method': 0,
            'toObj.local': 0,
            'toObj.__v': 0,
            'toObj.date': 0,
            'fromObj.method': 0,
            'fromObj.local': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
        });
});

module.exports = router;