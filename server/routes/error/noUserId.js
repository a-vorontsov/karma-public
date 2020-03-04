const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(400).send({
        message: "No userId specified in incoming request.",
    });
});

module.exports = router;
