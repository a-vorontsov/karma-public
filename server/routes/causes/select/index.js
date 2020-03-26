/**
 * @module Causes-select
 */

const log = require("../../../util/log");
const express = require('express');
const router = express.Router();
const selectedCauseRepository = require("../../../repositories/cause/selected");
const authService = require("../../../modules/authentication/");

/**
  * Called when the active user selects causes.<br/>
  * Request body should contain selected causes as an array of objects.
 <p><b>Route: </b>/causes/select (POST)</p>
 <p><b>Permissions: </b>requires user permissions</p>
 * @returns
 *  status: 200, description: Successful selection<br/>
 *  status: 400, description: No causes specified in body<br/>
 *  status: 500, description: Most probably a database error occurred
 *  @name Select causes
 *  @function
 */
router.post('/', authService.requireAuthentication, (req, res) => {
    const causes = req.body.data.causes; // this should contain the id of the causes selected by the user
    const userId = req.body.userId;
    log.info("User id '%d': Selecting causes '%s'", userId, causes.map(cause => cause.title).join(", "));
    if (!causes) {
        return res.status(400).send("No causes were specified in the body");
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
