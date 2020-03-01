const express = require("express");
const router = express.Router();

// TODO: invalidate token
router.delete("/", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

module.exports = router;
