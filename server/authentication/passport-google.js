const GoogleStrategy = require("passport-google-oauth20").Strategy;
const users = require("../authentication/user-agent");

/**
 * Passport's boilerplate.
 * Initialise the passport module for Google OAuth 2.0 use.
 * @param {} passport
 */
function initialise(passport) {
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
          return done(null, false, {
            message: "Email / user does not exist"
          });
        }
      }
    )
  );
}

module.exports = initialise;
