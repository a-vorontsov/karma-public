const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const status = req.query.status !== undefined ? req.query.status : 500;
    const message = req.query.message !== undefined ? req.query.message : "Unknown system error.";
    res.status(status).send({
        message: message,
    });
});

module.exports = router;
