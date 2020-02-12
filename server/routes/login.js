const express = require("express");
const router = express.Router();
const auth = require("../auth");

router.get("/login", auth.checkNotAuthenticated, (req, res) => {
  res.render("../views/login.ejs");
});

module.exports = router;