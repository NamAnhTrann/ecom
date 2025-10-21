const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bycrypt = require("bcrypt");
const User = require("../schema/user_schema");

//local strat
passport.use(
  new LocalStrategy(
    { usernameField: "user_email" },
    async (user_email, user_password, done) => {
      try {
        const user = await User.findOne({ user_email });
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const isMatch = await bycrypt.compare(
          user_password,
          user.user_password
        );
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ),

  //Google Strategy
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            fullname: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            roles: ["user"],
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ),

  //JWT Strategy --> for protected routes
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET_KEY,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.id);
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  )
);
module.exports = passport;
