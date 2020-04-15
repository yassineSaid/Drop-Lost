const User = require('../models/user');
const JWT = require('jsonwebtoken');
const fetch = require('node-fetch');

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

        const {nom,prenom,ville,adresse,numero, email, password } = req.value.body;
        // check if user already exists
        const foundUser = await User.findOne({ "email": email });
        if (foundUser) {
            return res.status(403).json({ error: 'email already exists' });
        }
        st = randomstring.generate();

        // create new user 
        const newUser = new User({
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
        res.cookie('access_token',token);
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        res.status(200).json({ User:req.user });
    },
    secret: async (req, res, next) => {
        console.log('i managed to get here');
        res.status(200).json({ secret: "resource" });
    },
    googleOAuth: async (req, res, next) => {
        const { idToken } = req.body;

        client.verifyIdToken({idToken,audience:"132856096478-jo705a4g0tu8ungd07r1fhocu1d9ccp3.apps.googleusercontent.com"})
        .then(response =>{
            const { email_verified, given_name,family_name, email } = response.payload;
            if(email_verified){
                User.findOne({"email": email}).exec((err, user) => {
                    if(user){
                        const token = signToken(user);
                        res.cookie('access_token',token);
                        res.status(200).json({ user });
                    }
                    else{
                        let newUser = new User({
                            method: 'google',
                            
                                nom:given_name,
                                prenom:family_name,
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
                              res.cookie('access_token',token);
                              res.status(200).json({ user });

        
                        })
                    }
                })
            }else {
                return res.status(400).json({
                  error: 'Google login failed. Try again'
                });
              }
            
        })
    },
    facebookOAuth: async (req, res, next) => {
  const { userID, accessToken } = req.body;
  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`
        return(
                fetch(url,{
                    method: 'GET'
                })
                .then(response => response.json())
                .then(response => {
                    const { email, name } = response;
                    User.findOne({"email": email}).exec((err, user) => {
                        if(user){
                            const token = signToken(user);
                            res.cookie('access_token',token);
                            res.status(200).json({ user });
                        }
                        else{
                            let newUser = new User({
                                method: 'facebook',
                                
                                    nom:name,
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
                                  res.cookie('access_token',token);
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
            const html = 'Hi there ,click here to reset your password ' + st + '</b>'

            var mailOptions = {
                from: 'DropLostAdmin@gmail.com',
                to: email,
                subject: 'Please verify you mail',
                text: html
            };
            transporter.sendMail(mailOptions, function (error, info) {
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
  }


}