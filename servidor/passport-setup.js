const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy(
    {
        clientID: "44495439503-6fnl179s1fjn5t0f3i4rvasf63ob8qdh.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/google/callback"
    },

    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));