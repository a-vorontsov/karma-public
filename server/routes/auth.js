const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/facebook/success",
    failureRedirect: "/auth/facebook/fail"
  })
);

router.get("/facebook/success", (req, res) => {
  res.status(200).send({ message: "Successful authentication with Facebook" });
});

router.get("/facebook/fail", (req, res) => {
  res.status(400).send({ message: "Failed to authenticate with Facebook" });
});

module.exports = router;
