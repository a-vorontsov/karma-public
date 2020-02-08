const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

/**
 * db needs to have the email set as unique
 * user should also store resetPasswordToken as a string and resetPasswordExpires as a date 
 * */


router.get('/', (req, res) => {
    res.send('forgot')
})
router.post('/',(req,res)=>{
    //gets called when the person submits the forgot password button
    const email =  req.body.email;
    db.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
        const user = result.rows[0];
        if (err) return err;
        else if (!user) {
            res.status(404).send({message:`There is no user with email ${email}`});
            return res.redirect('/');
        }
        //generate the token using crypto

        //store it in the user

    })

})

module.exports = router;