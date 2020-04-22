const User = require('../models/user');
const JWT = require('jsonwebtoken');
const fetch = require('node-fetch');
const Store = require('../models/store');
const Annonce = require('../models/annonce')
const url = require('url');

var randomstring = require("randomstring");
const nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("132856096478-jo705a4g0tu8ungd07r1fhocu1d9ccp3.apps.googleusercontent.com");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'droplost2020@gmail.com',
        pass: 'DropLost@2020'
    }
});
signToken = user => {
    return JWT.sign({
        iss: 'DropLost',
        sub: user.id,

    }, 'DropLostToken');
}

module.exports = {
    signUp: async (req, res, next) => {

        const { nom, prenom, ville, adresse, numero, email, password } = req.value.body;
        // check if user already exists
        const foundUser = await User.findOne({ "email": email });
        if (foundUser) {
            return res.status(403).json({ error: 'email already exists' });
        }
        st = randomstring.generate();

        // create new user 
        const newUser = new User({
            role: 'client',
            method: 'local',

            nom: nom,
            prenom: prenom,
            ville: ville,
            adresse: adresse,
            numero: numero,
            email: email,
            password: password,
            Isactive: false,
            secretToken: st



        });
        await newUser.save();
        const emailData = {
            from: "DropLostAdmin@gmail.com",
            to: email,
            subject: 'Account activation link',
            html: `
                      <h1>Please use the following to activate your account</h1>
                      <p>http://localhost:3000/custom-views/user-auth/lock-screen/${st}</p>
                      <hr />
                      <p>This email may containe sensetive information</p>
                      
                  `
        };

        transporter.sendMail(emailData, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        const token = signToken(newUser)

        res.status(200).json({ success: true });
    },


    signOut: async (req, res, next) => {
        res.clearCookie('access_token');
        // console.log('I managed to get here!');
        res.json({ success: true });
    },

    signIn: async (req, res, next) => {
        const token = signToken(req.user);
        res.cookie('access_token', token);
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        res.status(200).json({ User: req.user });
    },
    secret: async (req, res, next) => {
        console.log('i managed to get here');
        res.status(200).json({ secret: "resource" });
    },
    googleOAuth: async (req, res, next) => {
        const { idToken } = req.body;

        client.verifyIdToken({ idToken, audience: "132856096478-jo705a4g0tu8ungd07r1fhocu1d9ccp3.apps.googleusercontent.com" })
            .then(response => {
                const { email_verified, given_name, family_name, email } = response.payload;
                if (email_verified) {
                    User.findOne({ "email": email }).exec((err, user) => {
                        if (user) {
                            const token = signToken(user);
                            res.cookie('access_token', token);
                            res.status(200).json({ user });
                        }
                        else {
                            let newUser = new User({
                                method: 'google',

                                nom: given_name,
                                prenom: family_name,
                                email: email


                            });
                            newUser.save((err, data) => {
                                if (err) {
                                    console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                                    return res.status(400).json({
                                        error: 'User signup failed with google'
                                    });
                                }
                                const token = signToken(newUser);
                                res.cookie('access_token', token);
                                res.status(200).json({ user });


                            })
                        }
                    })
                } else {
                    return res.status(400).json({
                        error: 'Google login failed. Try again'
                    });
                }

            })
    },
    facebookOAuth: async (req, res, next) => {
        const { userID, accessToken } = req.body;
        const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`
        return (
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(response => {
                    const { email, name } = response;
                    User.findOne({ "email": email }).exec((err, user) => {
                        if (user) {
                            const token = signToken(user);
                            res.cookie('access_token', token);
                            res.status(200).json({ user });
                        }
                        else {
                            let newUser = new User({
                                method: 'facebook',

                                nom: name,
                                email: email


                            });
                            newUser.save((err, data) => {
                                if (err) {
                                    console.log('ERROR FAcebook LOGIN ON USER SAVE', err);
                                    return res.status(400).json({
                                        error: 'User signup failed with FAcebook'
                                    });
                                }
                                const token = signToken(newUser);
                                res.cookie('access_token', token);
                                res.status(200).json({ token });


                            })
                        }
                    })
                }).catch(error => {
                    res.json({
                        error: 'Facebook login failed. Try later'
                    });
                })
        )
    },
    verify: async (req, res, next) => {
        try {
            const secretToken = req.body.secretToken;
            const foundUser = await User.findOne({ "secretToken": secretToken });
            if (!foundUser) {
                return res.status(403).json({ error: 'No account found' });

            }

            await foundUser.updateOne({
                "secretToken": "",
                "Isactive": true
            }, { new: true }
            );




            res.status(200).json({ foundUser });
        } catch (error) {
            next(error);

        }

    },
    forget: async (req, res, next) => {
        try {
            const email = req.body.email;
            const foundUser = await User.findOne({ "email": email });
            if (!foundUser) {
                return res.status(403).json({ error: 'No account found' });

            }
            st = randomstring.generate();
            await foundUser.updateOne({
                "Passwordtoken": st,
                "PasswordResetDate": Date.now() + 3600000
            }, { new: true }
            );
            const emailData = {
                from: "DropLostAdmin@gmail.com",
                to: email,
                subject: 'Account password change ',
                html: `
                          <h1>Please use the following to change your password</h1>
                          <p>http://localhost:3000/custom-views/user-auth/reset-password/${st}</p>
                          <hr />
                          <p>This email may containe sensetive information</p>
                          
                      `
            };
            transporter.sendMail(emailData, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });


            res.status(200).json({ foundUser });
        } catch (error) {
            next(error);

        }

    },
    resetPassword: async (req, res, next) => {
        try {
            const secretToken = req.body.secretToken;
            const foundUser = await User.findOne({ "Passwordtoken": secretToken, "PasswordResetDate": { $gt: Date.now() } });

            if (!foundUser) {
                return res.status(403).json({ error: 'Password reset token is invalid or has expired' });

            }
            if (req.body.newpassword != req.body.confirmnewpassword) {
                return res.status(403).json({ error: 'check the passwords that you have entered' });

            }
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(req.body.newpassword, salt);
            await foundUser.updateOne({
                "password": passwordHash,
                "Passwordtoken": undefined,
                "PasswordResetDate": undefined
            }, { new: true }
            );
            res.status(200).json({ foundUser });

        } catch (error) {
            next(error);

        }

    },
    checkAuth: async (req, res, next) => {
        res.json({ User: req.user });
    },
    addAdmin: async (req, res, next) => {

        const { nom, prenom, ville, adresse, numero, email, password } = req.value.body;
        // check if user already exists
        const foundUser = await User.findOne({ "email": email });
        if (foundUser) {
            return res.status(403).json({ error: 'email already exists' });
        }
        st = randomstring.generate();

        // create new user 
        const newUser = new User({
            role: 'admin',
            method: 'local',

            nom: nom,
            prenom: prenom,
            ville: ville,
            adresse: adresse,
            numero: numero,
            email: email,
            password: password,
            Isactive: true,




        });
        await newUser.save();
        const emailData = {
            from: "DropLostAdmin@gmail.com",
            to: email,
            subject: 'New account created',
            html: `
                  <h3>Welcome to drop&lost <a href="http://localhost:3000/signin">click here</a> to log in and use these</h3>
                  <h4>email :${email}</h4>
                  <h4>password :${req.value.body.password}</h4>

                  <hr />
                  <p>This email may containe sensetive information</p>
                  
              `
        };

        transporter.sendMail(emailData, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        res.status(200).json({ success: true });
    },
    allAdmins: async (req, res, next) => {
        AdminsList = await User.find({ "role": "admin" });
        res.status(200).json({ success: true, AdminsList });

    },
    allUsers: async (req, res, next) => {
        AdminsList = await User.find({ "role": "user" });
        res.status(200).json({ success: true, AdminsList });

    },
    makeUser: async (req, res, next) => {
        foundUser = await User.findOne({ "email": req.body.email });
        await foundUser.updateOne({
            "role": "user"
        }, { new: true }
        );
        res.status(200).json({ foundUser });

    }
    ,
    makeAdmin: async (req, res, next) => {
        foundUser = await User.findOne({ "email": req.body.email });
        await foundUser.updateOne({
            "role": "admin"
        }, { new: true }
        );
        res.status(200).json({ foundUser });

    },
    banUser: async (req, res, next) => {
        foundUser = await User.findOne({ "email": req.body.email });
        await foundUser.updateOne({
            "Isactive": false
        }, { new: true }
        );
        const emailData = {
            from: "DropLostAdmin@gmail.com",
            to: req.body.email,
            subject: 'Account banned',
            html: `
                  <h3>Your account has been banned , therefore you won't be able to login or use the application</h3>
                  <h4>Contact DropLostAdmin@gmail.com for futhur information </h4>

                  <hr />
                  <p>This email may containe sensetive information</p>
                  
              `
        };

        transporter.sendMail(emailData, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(200).json({ foundUser });

    }
    ,
    unbanUser: async (req, res, next) => {
        foundUser = await User.findOne({ "email": req.body.email });
        await foundUser.updateOne({
            "Isactive": true
        }, { new: true }
        );
        res.status(200).json({ foundUser });

    },
    addAgent: async (req, res, next) => {
        console.log(req.body)
        const { nom, prenom, ville, adresse, numero, email, password } = req.body;
        // check if user already exists
        const foundUser = await User.findOne({ "email": email });
        if (foundUser) {
            return res.status(403).json({ error: 'email already exists' });
        }
        st = randomstring.generate();

        // create new user 
        const newUser = new User({
            role: 'agent',
            method: 'local',

            nom: nom,
            prenom: prenom,
            ville: ville,
            adresse: adresse,
            numero: numero,
            email: email,
            password: password,
            Isactive: true,




        });
        await newUser.save();
        const emailData = {
            from: "DropLostAdmin@gmail.com",
            to: email,
            subject: 'New account created',
            html: `
                        <h3>Welcome to drop&lost <a href="http://localhost:3000/signin">click here</a> to log in and use these</h3>
                        <h4>email :${email}</h4>
                        <h4>password :${req.body.password}</h4>
      
                        <hr />
                        <p>This email may containe sensetive information</p>
                        
                    `
        };

        transporter.sendMail(emailData, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        res.status(200).json({ success: true });
    },
    allAgents: async (req, res, next) => {
        agentslist = await User.find({ "role": "agent" });
        res.status(200).json({ success: true, agentslist });

    },
    liststores: async (req, res, next) => {
        storelist = await Store.find()
        res.status(200).json({ success: true, storelist });

    },

    
    listobjectsinstore: async (req, res, next) => {
        
        console.log(req.params.nom);
                 Store.find({ "nom": req.params.nom }).populate("ObjectsInStore").
         exec(function (err, store) {
           if (err) return handleError(err);
           res.status(200).json({ success: true, store });
        });

    },
    addStore: async (req, res, next) => {
        console.log(req.body)
        const { nom, ville, adresse, numero } = req.body;

        const foundStore = await Store.findOne({ "nom": nom });
        if (foundStore) {
            return res.status(403).json({ error: 'store already exists' });
        }
        const newStore = new Store({


            nom: nom,

            ville: ville,
            adresse: adresse,
            numero: numero,




        });
        await newStore.save();
        res.status(200).json({ success: true });

    },
    addObjectToStore: async (req, res, next) => {
        const { nom, _id } = req.body;
        const foundannonce = await Annonce.findOne({ "_id": _id });
        if (!foundannonce) {
            return res.status(403).json({ error: 'annonce not found' });
        }
        const foundStore = await Store.findOne({ "nom": nom });
        if (!foundStore) {
            return res.status(403).json({ error: 'store not found' });
        }
        if (foundStore.ObjectsInStore.indexOf(_id) === -1) {
            foundStore.ObjectsInStore.push(foundannonce._id);
            foundStore.save();
            res.status(200).json({ success: true });

        }
        else {
            return res.status(403).json({ error: 'object already in store' });

        }
        



    },
    deleteObjectfromStore: async (req, res, next) => {
        const { nom, _id } = req.body;
        const foundannonce = await Annonce.findOne({ "_id": _id });
        if (!foundannonce) {
            return res.status(403).json({ error: 'annonce not found' });
        }
        const foundStore = await Store.findOne({ "nom": nom });
        if (!foundStore) {
            return res.status(403).json({ error: 'store not found' });
        }
        if (foundStore.ObjectsInStore.indexOf(_id) != -1) {
            foundStore.ObjectsInStore.pull(_id);
            foundStore.save();
            res.status(200).json({ success: true });

        }
        else {
            return res.status(403).json({ error: 'object already in store' });

        }

}}