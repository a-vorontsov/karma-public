const express = require("express");
const router = express.Router();
const auth = require("../auth");

router.get("/register", auth.checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

module.exports = router;