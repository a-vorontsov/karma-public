const express = require('express');
const router = express.Router();
const causeRepository = require("../models/causeRepository");

router.get('/', (req, res) => {
    causeRepository.getAll()
        .then(result => res.status(200).json(result.rows))
        .catch(err => res.status(500).send(err));
});

/**
 * gets called when a cause is pressed (to show more info for example)
 * url example: http://localhost:8000/causes/1
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).send("No id was specified");
    if (!id.isInteger) return res.status(400).send("ID specified is in wrong format");
    causeRepository.findById(id)
        .then(result => {
            if (result.rows.length == 0) return res.status(404).send("No cause with specified id");
            res.status(200).json(result.rows);
        })
        .catch(err => res.status(500).send(err));
});


module.exports = router;
