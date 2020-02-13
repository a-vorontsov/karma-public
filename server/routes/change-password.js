const express = require("express");
const router = express.Router();
const users = require("../authentication/user-agent");
const auth = require("../authentication/auth");
var owasp = require("owasp-password-strength-test");

router.get("/", auth.checkAuthenticated, (req, res) => {
  res.render("change-password.ejs", { name: req.user.name });
});

router.post("/", auth.checkAuthenticated, async (req, res) => {
  const passStrengthTest = owasp.test(req.body.newpassword);
  if (!passStrengthTest.strong && process.env.ANY_PASSWORD !== "SKIP_CHECKS") {
    // To send it as json array
    res.send(passStrengthTest.errors);
  } else if (req.body.newpassword !== req.body.confirmpassword) {
    res.send("Passwords do not match.");
  } else if (!users.isCorrectPassword(req.user, req.body.oldpassword)) {
    res.send("Incorrect old password.");
  } else {
    try {
      users.updatePassword(req);
      res.send("Success.");
    } catch {
      res.redirect("/edit/password");
    }
  }
});

module.exports = router;
