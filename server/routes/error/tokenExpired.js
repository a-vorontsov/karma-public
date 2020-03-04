const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(400).send({
        message: "Sent authToken exired.",
    });
});

module.exports = router;
