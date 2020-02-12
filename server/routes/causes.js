const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send("All causes");
});
router.get('/:id',(req,res)=>{
    
})

module.exports = router;