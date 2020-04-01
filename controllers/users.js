const User = require('../models/user');
const JWT = require('jsonwebtoken');
var randomstring = require("randomstring");
const nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'droplost2020@gmail.com',
        pass: 'droplost@2020'
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

        const { email, password } = req.value.body;
        // check if user already exists
        const foundUser = await User.findOne({ "local.email": email });
        if (foundUser) {
            return res.status(403).json({ error: 'email already exists' });
        }
        st = randomstring.generate();

        // create new user 
        const newUser = new User({
            method: 'local',
            local: {
                email: email,
                password: password,
                Isactive: false,
                secretToken: st
            }


        });
        await newUser.save();
        const html = 'Hi there ,<br>thank you for registring<br> please verify you account by clicking here <br>Token:<b>' + st + '</b>'

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
        const token = signToken(newUser)
        res.status(200).json({ token: token });
    },
    signIn: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
        console.log('sucessful login');
    },
    secret: async (req, res, next) => {
        console.log('i managed to get here');
        res.status(200).json({ secret: "resource" });
    },
    googleOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    facebookOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });

    },
    verify: async (req, res, next) => {
        try {
            const secretToken = req.body.secretToken;
            console.log(secretToken)
            const foundUser = await User.findOne({ "local.secretToken": secretToken });
            if (!foundUser) {
                return res.status(403).json({ error: 'No account found' });

            }

            await foundUser.updateOne({
                "local.secretToken": "",
                "local.Isactive": true
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
            console.log(email)
            const foundUser = await User.findOne({ "local.email": email });
            if (!foundUser) {
                return res.status(403).json({ error: 'No account found' });

            }
            st = randomstring.generate();
            await foundUser.updateOne({
                "local.Passwordtoken": st,
                "local.PasswordResetDate": Date.now() + 3600000
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
            console.log(secretToken)
            const foundUser = await User.findOne({ "local.Passwordtoken": secretToken,"local.PasswordResetDate":{$gt:Date.now()} });
            if (!foundUser) {
                return res.status(403).json({ error: 'Password reset token is invalid or has expired' });

            }
            if (req.body.newpassword!=req.body.confirmnewpassword) {
                return res.status(403).json({ error: 'check the passwords that you have entered' });

            }
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(req.body.newpassword, salt);
          await foundUser.updateOne({
              "local.password": passwordHash,
              "local.Passwordtoken": undefined,
              "local.PasswordResetDate": undefined
          }, { new: true }
          );
            res.status(200).json({ foundUser });

        } catch (error) {
            next(error);

        }

    }

}