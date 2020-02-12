const express = require("express");
const router = express.Router();
const users = require("../authentication/user-agent");
const auth = require("../authentication/auth");

router.get("/", auth.checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

router.post("/", auth.checkNotAuthenticated, async (req, res) => {
  try {
    users.register(req);
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

module.exports = router;