const log = require("../../../util/log");
const express = require('express');
const router = express.Router();
const selectedCauseRepository = require("../../../repositories/cause/selected");
const authService = require("../../../modules/authentication/");

/**
 * gets called when user selects causes
 * body should contain causes array holding cause objects
 * cause objects need property id
 * */
router.post('/', authService.requireAuthentication, (req, res) => {
    const causes = req.body.data.causes; // this should contain the id of the causes selected by the user
    const userId = req.body.userId;
    log.info("User id '%d': Selecting causes '%s'", userId, causes.map(cause => cause.title).join(", "));
    if (!causes) {
        return res.status(400).send("No causes were specified in the body");
    }
    if (!userId) {
        return res.status(400).send("No user id was specified");
    }
    // get all ids of causes selected
    const ids = [...causes.map(cause => cause.id)];
    // update db
    selectedCauseRepository.unselectAll(userId, ids)
        .then(result => {
            return selectedCauseRepository.insertMultiple(userId, ids);
        })
        .then(insertResult =>{
            res.status(200).send({
                message: "Successfully selected causes for user " + userId,
                data: insertResult.rows,
            });
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;
