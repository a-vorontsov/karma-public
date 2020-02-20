const express = require('express');
const router = express.Router();
const causeRepository = require("../models/causeRepository");

/**
 * @route {GET} /causes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns:
 *  status: 200, @description: Array of all cause objects
 *  status: 500, @description: Most probably a database error occured
 */
router.get('/', (req, res) => {
    causeRepository.getAll()
        .then(result => res.status(200).json(result.rows))
        .catch(err => res.status(500).send(err));
});

/**
 * @route {GET} /causes/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {integer} req.params.id - ID of the cause required
 * @returns:
 *  status: 200, @description: cause object with given id
 *  status: 400, @description: if ID param is not convertible to an integer
 *  status: 404, @description: no cause was found in DB with ID
 *  status: 500, @description: Most probably a database error occured
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).send("No id was specified");
    if (isNaN(id)) return res.status(400).send("ID specified is in wrong format");
    causeRepository.findById(id)
        .then(result => {
            if (result.rows.length == 0) return res.status(404).send("No cause with given id");
            res.status(200).json(result.rows);
        })
        .catch(err => res.status(500).send(err));
});


module.exports = router;
