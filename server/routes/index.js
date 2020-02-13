const express = require("express");
const router = express.Router();
const auth = require("../authentication/check-auth");

router.get("/", auth.checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

module.exports = router;
