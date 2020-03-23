/**
 * @module Causes
 */
const log = require("../../util/log");
const express = require('express');
const router = express.Router();
const causeRepository = require("../../models/databaseRepositories/causeRepository");
const authAgent = require("../../modules/authentication/auth-agent");

/**
 * Gets all causes.<br/>
 <p><b>Route: </b>/causes (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @returns
 *  status: 200, description: Array of all cause objects<br/>
 *  status: 500, description: Most probably a database error occurred
 *  @name Get all causes
 *  @function
 */
router.get('/', authAgent.requireAuthentication, (req, res) => {
    log.info("Getting all causes");
    causeRepository.findAll()
        .then(result => res.status(200).json({data: result.rows}))
        .catch(err => res.status(500).send(err));
});

/**
 * Gets a cause specified by id.<br/>
 <p><b>Route: </b>/causes/:id (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {number} req.params.id - ID of the cause required
 * @returns
 *  status: 200, description: cause object with given id <br/>
 *  status: 400, description: if ID param is not specified or in wrong format/NaN <br/>
 *  status: 404, description: no cause was found in DB with ID <br/>
 *  status: 500, description: Most probably a database error occurred
 *  @name Get by ID
 *  @function
 */
router.get('/:id', authAgent.requireAuthentication, (req, res) => {
    const id = req.params.id;
    log.info("Getting cause id %d", id);
    if (!id) return res.status(400).send("No id was specified");
    if (isNaN(id)) return res.status(400).send("ID specified is in wrong format");
    causeRepository.findById(id)
        .then(result => {
            if (result.rows.length === 0) return res.status(404).send("No cause with given id");
            res.status(200).json({data: result.rows});
        })
        .catch(err => res.status(500).send(err));
});


module.exports = router;
