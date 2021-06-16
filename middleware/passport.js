const passport = require('passport');
const LocalStrategy = require('passport-local')
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const { JWT_SECRET, auth } = require('../config')
const User = require('../models/Users');
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('Authorization');
opts.secretOrKey = JWT_SECRET;
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const user = await User.find({ _id: jwt_payload.sub })
        if (!user) return done(null, false);
        return done(null, user);
    } catch (err) {
        done(err, false);
    }
}));
// passport-local
passport.use(new LocalStrategy({
    usernameField: 'email',
}, async(email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false);
        const isCorrectPassword = await user.isValidPassword(password);
        if (!isCorrectPassword) return done(null, false)
        done(null, user)
    } catch (error) {
        done(null, false)
    }
}))

passport.use(new GooglePlusTokenStrategy({ // passport google plus
    clientID: auth.google.CLIENT_ID,
    clientSecret: auth.google.CLIENT_SECRET,
}, async(accessToken, refreshToken, profile, done) => {
    try {
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        console.log("profile", profile)
        const user = await User.findOne({
            authGoogleId: profile.id,
            authType: "google",
        })
        if (user) return done(null, user)
            // khong co thif  tao ra user
        const newUser = new User({
            authType: 'google',
            authGoogleId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.familyName,
            lastName: profile.name.givenName
        })
        await newUser.save();
        done(null, newUser)
    } catch (error) {
        console.log(error)
        done(null, false)
    }
}))

passport.use(new FacebookTokenStrategy({ // facebook
    clientID: auth.facebook.CLIENT_ID,
    clientSecret: auth.facebook.CLIENT_SECRET,
    fbGraphVersion: 'v3.0'
}, async function(accessToken, refreshToken, profile, done) {
    try {
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        console.log("profile", profile)
        const user = await User.findOne({
            authFacebookId: profile.id,
            authType: "facebook",
        })
        if (user) return done(null, user)
            // khong co thif  tao ra user
        const newUser = new User({
            authType: 'facebook',
            authFaceBookId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.familyName,
            lastName: profile.name.givenName
        })
        await newUser.save();
        done(null, newUser)
    } catch (error) {
        console.log(error)
        done(null, false)
    }

}));