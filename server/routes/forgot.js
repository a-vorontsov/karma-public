const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const randomize = require('randomatic');
const db = require('../database/connection');


/**
 * db needs to have the email set as unique
 * user should also store resetPasswordToken as a string and resetPasswordExpires as a date 
 * 
 * psql -U postgres karma-db
 * */


router.get('/', (req, res) => {
    res.send('forgot')
})
router.post('/', (req, res) => {
    //gets called when the person submits the forgot password button
    let email = '';
    try {
        email = req.body.email;
    } catch (err) {
        return res.status(400).send(err);
    }
    console.log(email);
    db.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
        const user = result.rows[0];
        if (err) return err;
        else if (!user) {
            return res.status(404).send({
                message: `There is no user with email ${email}`
            });
        }
        //generate 6 digit code
        const token = randomize('0', 6);
        //store it in the user
        const updateUserQuery = `Update users 
        set resetpasswordtoken = ${token},
        resetPasswordExpires = ${Date.now()+360000}
        where email = \'${email}\'`;

        db.query(updateUserQuery, (err, result) => {
            if (err) return res.status(500).send(err);
            else {
                console.log("User updated successfuly");
            }
        });
        //send the email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.EMAIL_PASSWORD}`,
            },
        });
        const mailOptions = {
            from: `${process.env.EMAIL_ADDRESS}`,
            to: `${email}`,
            subject: 'Reset Password Verification Code',
            text: `K-${token} is your karma verification code`
        };

        console.log("Sending mail");
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                return res.status(500).send(err);
            } else {
                res.status(200).send("Code sent successfully to " + email);
            }
        });
    });

})
router.post('/confirm', (req, res) => {
    let email = '';
    let token;
    try {
        token = req.body.token;    
        email = req.body.email;
    } catch (err) {
        return res.status(400).send(err);
    }
    db.query('SELECT resetpasswordtoken FROM users WHERE email = $1', [email], (err, result) => {
        if (err) return err;
        const tokenRecieved = result.rows[0].resetpasswordtoken;
        if(token === tokenRecieved){
            res.status(200).send("Tokens matched");
        }
        else{
            res.status(401).send("Tokens did not match");
        }
    });

});

module.exports = router;