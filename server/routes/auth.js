const express = require("express");
const router = express.Router();
const passport = require("passport");

// -- OAUTH - Facebook -- //

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

// -- OAUTH - Google -- //

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/fail"
  })
);

router.get("/google/success", (req, res) => {
  res.status(200).send({ message: "Successful authentication with Google" });
});

router.get("/google/fail", (req, res) => {
  res.status(400).send({ message: "Failed to authenticate with Google" });
});

module.exports = router;
