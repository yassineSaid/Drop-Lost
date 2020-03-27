const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('./models/user')
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusPassportStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');

// JSON web tokens strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('auth'),
    secretOrKey: 'DropLostToken'
}, async (payload, done) => {
    try {
        //find the user in token
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }

        // otherwise return the user
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

//Google Oauth
passport.use('googleToken', new GooglePlusPassportStrategy({
    clientID: '132856096478-jo705a4g0tu8ungd07r1fhocu1d9ccp3.apps.googleusercontent.com',
    clientSecret: 'ZrQKjQ-P0X9063PXlYsjjTxH'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);

        //check wether this current user exists in DB
        const existingUser = await User.findOne({ "google.id": profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        //if new account

        let newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }

        });
        console.log(newUser)
        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }

}));
//Facebook strategy

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: '212504969965178',
    clientSecret: 'e980bd21d4878fdeb77fbae2d62919ea'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);
        const existingUser = await User.findOne({ "facebook.id": profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        //if new account

        let newUser = new User({
            method: 'facebook',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value
            }

        });
        console.log(newUser)
        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }

}));
// Local strategy

passport.use(new LocalStrategy({

    usernameField: 'email'

}, async (email, password, done) => {
    try {
        //find the user 
        const user = await User.findOne({ "local.email": email });
        console.log(user)

        //if not , handle it 
        if (!user) {
            return done(null, false);
        }
        //Check if the password is correct

        const isMatch = await user.isValidPassword(password);

        //if not , handle it
        if (!isMatch) {
            console.log("is match " + isMatch)
            return done(null, false);
        }
        if (!user.local.Isactive) {
            console.log("is active " + user.local.Isactive)
            return done(null, false);
        }
        //Otherwise , return the user
        done(null, user);
    } catch (error) {
        done(error, false);
    }

}));