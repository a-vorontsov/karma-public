const express = require("express");
const router = express.Router();

/**
 * Attempt to store bug report in database.
 * Returns result of operation.
 * @param {HTTP} req must contain emailAddr, reportBody
 * @return {HTTP} res
 */
router.post("/", async (req, res) => {
    try {
        pushPugReport(req);
        res.status(200).send({message: "Successful registration."});
    } catch (e) {
        res.status(400).send({message: e.message});
    }
});

/**
 * Push bug report to database
 * @param {JSON} req
 */
function pushPugReport(req) {
    // TODO:
    // req.reportBody
}

module.exports = router;
