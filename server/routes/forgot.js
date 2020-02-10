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
        //generate 6 digit code
        const token = randomize('0',6);
        //store it in the user
        db.query(`Update users set resetPasswordToken = ${token},resetPasswordExpires = ${Date.now()+360000}  where email <= ${email}`,(err,result)=>{
            if(err) res.send(err);
            else{
                console.log("updated successfuly");
            }
        })
        //send the email
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user:'teamteam.karma@gmail.com',
                pass:'harDforcharity69',
            },
        });
        const mailOptions = {
            from:'teamteam.karma@gmail.com',
            to:`${email}`,
            subject: 'Reset Password Verification Code',
            text: `K-${token} is your karma verification code`
        };

        console.log("Sending mail");
        transporter.sendMail(mailOptions,(err,response)=>{
            if(err){
                console.log("there was an error in sending the email");
            }
            else{
                console.log("this is the response" + res);
                res.status(200).send("code sent");
                res.redirect()
            }
        });
    });

})

module.exports = router;