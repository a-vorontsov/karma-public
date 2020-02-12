const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/', (req, res) => {
    const query = 'SELECT * FROM causes';
    db.query(query, [], (err, result) => {
        if (err) {
            return err;
        }
        res.status(200).send({users: result.rows})
    });
});

module.exports = router;