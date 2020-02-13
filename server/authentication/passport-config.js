const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const digest = require("./digest");
const users = require("../authentication/user-agent");

/**
 * Passport's boilerplate.
 * Initialise the passport module for use.
 * @param {} passport
 * @param {function} getUserByEmail
 * @param {function} getUserById
 */
function initialise(passport, getUserByEmail, getUserById) {
  // -- LOCAL -- //

  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "Email / user does not exist" });
    }

    try {
      if (digest.hashPassWithSaltInHex(password, user.salt) === user.password) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (e) {
      // if error
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });

  // -- OAUTH - Facebook -- //

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://127.0.0.1:8000/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        const user = users.findByEmail(profile.email);
        if (user !== null) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Email / user does not exist" });
        }
      }
    )
  );

  // -- OAUTH - Google -- //

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:8000/auth/google/callback"
      },
      function(token, tokenSecret, profile, done) {
        const user = users.findByEmail(profile.email);
        if (user !== null) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Email / user does not exist" });
        }
      }
    )
  );

  // -- OAUTH - Linkedin -- //

  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_KEY,
        clientSecret: process.env.LINKEDIN_SECRET,
        callbackURL: "http://127.0.0.1:8000/auth/linkedin/callback",
        scope: ["r_emailaddress", "r_basicprofile"]
      },
      function(accessToken, refreshToken, profile, done) {
        const user = users.findByEmail(profile.email);
        if (user !== null) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Email / user does not exist" });
        }
      }
    )
  );
}

module.exports = initialise;
