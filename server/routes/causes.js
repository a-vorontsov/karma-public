const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/', (req, res) => {
    const query = 'SELECT * FROM causes';
    db.query(query, [], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result.rows);
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send("No id was specified");
    }
    const query = `SELECT * FROM causes where id = '${id}'`;
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
router.post('/', (req, res) => {
    const causes = req.body.causes;
    if (!id) {
        return res.status(400).send("No causes were specified in the body");
    }
    // update the db
});

module.exports = router;
