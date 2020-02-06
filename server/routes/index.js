const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const output = generateOutput();
    res.send(output);
})

const generateOutput = ()=>{
    var x = 1;
    var output = "";
    while (x <= 100) {
        output += "TeamTeam";
        if(x%10===0) output+="<br>";
        x++;
    }
    return output
}

module.exports = router;