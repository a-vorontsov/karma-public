const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/', (req, res) => {
    const query = 'SELECT * FROM causes';
    db.query(query, [], (err, result) => {
        if (err) {
            return err;
        }
        res.status(200).send({causes: result.rows});
    });
});
router.get('/:id',(req,res)=>{
    let id = req.body.id;
    if(!id){
        return res.status(400).send("No id was specified in the body");
    }
    const query = `SELECT * FROM causes where id = '${id}'`;
    db.query(query, [], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        else if(result.rows.length == 0){
            return res.status(400).send("There is no cause with that id")
        }
        res.status(200).send({cause: result.rows});
    });
});

module.exports = router;