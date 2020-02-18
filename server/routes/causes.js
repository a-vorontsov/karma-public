const express = require('express');
const router = express.Router();
const db = require('../database/connection');
const selectedCauseRepository = require("../models/selectedCauseRepository");

router.get('/', (req, res) => {
    const query = 'SELECT * FROM cause';
    db.query(query, [], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result.rows);
    });
});
// ToDo: Sort by distance
router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send("No id was specified");
    }
    const query = `SELECT * FROM cause where id = '${id}'`;
    db.query(query, [], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        } else if (result.rows.length == 0) {
            return res.status(400).send("There is no cause with that id");
        }
        res.status(200).json(result.rows);
    });
});

// gets called when user selects causes
router.post('/select', (req, res) => {
    const causes = req.body.causes; // this should contain the id of the causes selected by the user
    const user = req.body.user;
    if (!causes) {
        return res.status(400).send("No causes were specified in the body");
    }
    if (!user.id) {
        return res.status(400).send("No user id was specified in the body");
    }
    const ids = [];
    for (let i = 0; i < causes.length; i++) {
        ids.push(causes[i].id);
    }
    const resultObject = {};
    selectedCauseRepository.insertSelected(user.id, ids)
        .then(result => {
            resultObject.inserted = result.rows;
            return selectedCauseRepository.deleteUnselected(user.id, ids);
        })
        .then(deleteResult =>{
            resultObject.deleted = deleteResult.rows;
            return res.status(200).send(resultObject);
        })
        .catch(err => res.status(500).send(err));
});


module.exports = router;
