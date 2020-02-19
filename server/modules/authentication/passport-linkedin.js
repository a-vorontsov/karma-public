const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const users = require("../authentication/user-agent");

/**
 * Passport's boilerplate.
 * Initialise the passport module for Linkedin OAuth 2.0 use.
 * @param {Object} passport
 */
function initialise(passport) {
    passport.use(
        new LinkedInStrategy(
            {
                clientID: process.env.LINKEDIN_KEY,
                clientSecret: process.env.LINKEDIN_SECRET,
                callbackURL: "http://127.0.0.1:8000/auth/linkedin/callback",
                scope: ["r_emailaddress", "r_basicprofile"],
                state: true,
            },
            function(accessToken, refreshToken, profile, done) {
                const user = users.findByEmail(profile.email);
                if (user !== null) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: "Email / user does not exist",
                    });
                }
            },
        ),
    );
}

module.exports = initialise;
