const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(400).send({
        message: "User not found.",
    });
});

module.exports = router;
