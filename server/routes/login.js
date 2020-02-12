const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../auth");

router.get("/", auth.checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/",
  auth.checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

module.exports = router;