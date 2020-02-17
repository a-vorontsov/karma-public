const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/', (req, res) => {
    const query = 'SELECT * FROM cause';
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
router.post('/', (req, res) => {
    const causes = req.body.causes; // this should contain the id of the causes selected by the user
    const user = req.body.user;
    if (!causes) {
        return res.status(400).send("No causes were specified in the body");
    }
    if (!user.id) {
        return res.status(400).send("No user id was specified in the body");
    }
    console.log(user);
    for (let i = 0; i < causes.length; i++) {
        console.log(causes[i]);
        const query = `insert into selected_cause values(${user.id},${causes[i].id})`;
        db.query(query, (err, result) => {
            if (err) console.log(err);
        });
    };
    const query = `select * from selected_cause where user_id = \'${user.id}\'`;
    db.query(query, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(result.rows);
    });

    // update the db
});

module.exports = router;
