var express = require('express');
var router = require('express-promise-router')();
const jwt = require('jsonwebtoken');
const Notific = require('../../models/Notification');
const User = require('../../models/user');
const mongoose = require('mongoose');
const keys = require('../../config/default');
//verify token
const verify = req => {
    if (req.cookies.access_token) {
        return req.cookies.access_token;
    }
    throw new Error;
};
router.post('/addNotification', async (req,res) => {

    const notif = new Notific(
        req.body
    );
  
    try {
        const savedComment = await notif.save();
        const savedCommentWithUserData =  await Notific.findById(savedComment._id);
        const savedrecipients=  await savedCommentWithUserData.updateOne(
            { $addToSet: { recipients: req.body.recipients } },
          ); 
        res.send(savedComment); 
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }
})
router.get('/allNotifications' , async (req, res, next) => {

   let user = mongoose.Types.ObjectId(req.query.userId);
        try {
            const notifications = await Notific
           .find( { recipients: { $all: [user] } } )
           .sort({'createdAt':-1});
            res.status(200).json({ notifications });
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errors: err });
        }
});

router.get('/allNotificationsTest' , async (req, res, next) => {

    let user = mongoose.Types.ObjectId(req.query.userId);
         try {
             const notifications = await Notific.find();
             res.status(200).json({ notifications });
         }
         catch (err) {
             console.log(err)
             res.status(500).json({ success: false, errors: err });
         }
 });



router.route('/getAllUsersToVerifyTheNotifications').get(async (req, res, next) => {
    UsersList = await User.find({ "role": "user" });
    idusers=[];
    UsersList.forEach(item => {

        idusers.push(item._id);
    })
    res.status(200).json({ UsersList });

}
);

module.exports = router;