const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");
const { application } = require("express");
const User = mongoose.model("users");




passport.serializeUser((user,done)=>{
  
done(null,user.id);

});


passport.deserializeUser((id,done)=>{
  User.findById(id)
  .then((user)=>{
    done(null,user);
  })
});


passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);
      console.log("done", done);
      //mongdb model instance
      //find User
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          // there is already a record with given profile Id
          console.log("usr exists",existingUser)
          done(null,existingUser)
        } else {
          //save googleId to mongodb 
          new User({ googleId: profile.id }).save().then((user)=> done(null,user))
        }
      });
    }
  )
);
