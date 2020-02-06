const express = require('express');
const router = express.Router();

let users = [
    {
        id: 1,
        name: "whatever"
    }
];

router.get('/', (req, res) => {
    res.send("All users should be displayed here")
})
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id))
    if (!user) {
        res.status(404).send(`There is no user with id ${req.params.id}`)
        return;
    }
    res.send(`User with id ${req.params.id} should be displayed`)

})
module.exports = router;