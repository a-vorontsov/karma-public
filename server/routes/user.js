const express = require('express');
const router = express.Router();
const selectedCauseRepository = require("../models/databaseRepositories/selectedCauseRepository");

/**
 * gets called when user selects causes
 * body should contain causes array holding cause objects
 * cause objects need property id
 * */
router.post('/:id/causes', (req, res) => {
    const causes = req.body.causes; // this should contain the id of the causes selected by the user
    const userId = req.params.id;
    if (!causes) {
        return res.status(400).send("No causes were specified in the body");
    }
    if (!userId) {
        return res.status(400).send("No user id was specified");
    }
    const resultObject = {};
    // get all ids of causes selected
    const ids = [...causes.map(cause => cause.id)];
    // update db
    selectedCauseRepository.insertMultiple(userId, ids)
        .then(result => {
            resultObject.inserted = result.rows;
            return selectedCauseRepository.deleteUnselected(userId, ids);
        })
        .then(deleteResult =>{
            resultObject.deleted = deleteResult.rows;
            res.status(200).send(resultObject);
        })
        .catch(err => res.status(500).send(err));
});
module.exports = router;
