const express = require('express');
const router = express.Router();
const db = require('../database/connection');


router.get('/', (req, res) => {
    db.query('SELECT * FROM users', [], (err, result) => {
        if (err) {
            return err;
        }
        res.status(200).send({users: result.rows})
    })
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, result) => {
        const user = result.rows[0];
        if (err) {
            return err;
        } else if (!user) {
            res.status(404).send({message:`There is no user with id ${req.params.id}`});
            return;
        }
        res.send(user)
    })
});

module.exports = router;