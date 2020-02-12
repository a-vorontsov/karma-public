const express = require("express");
const router = express.Router();
const users = require("../authentication/user-agent");
const auth = require("../authentication/auth");
var owasp = require("owasp-password-strength-test");

owasp.config({
  allowPassphrases: true,
  maxLength: 128,
  minLength: 8,
  minPhraseLength: 20,
  minOptionalTestsToPass: 4
});

router.get("/", auth.checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

router.post("/", auth.checkNotAuthenticated, async (req, res) => {
  const passStrengthTest = owasp.test(req.body.password);
  if (passStrengthTest.strong) {
    try {
      users.register(req);
      res.redirect("/login");
    } catch {
      res.redirect("/register");
    }
  } else {
    // To send it as json array
    // res.send(passStrengthTest.errors);
    res.redirect("/register");
  }
});

module.exports = router;