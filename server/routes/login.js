const express = require("express");
const router = express.Router();
const auth = require("../auth");

router.get("/", auth.checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

module.exports = router;