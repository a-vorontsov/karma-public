const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("All users should be displayed here")
})
router.get('/:id', (req, res) => res.status(200).send(`User with id ${req.params.id} should be displayed`))

module.exports = router;