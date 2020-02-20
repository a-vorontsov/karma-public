const express = require('express');
const router = express.Router();
const randomize = require('randomatic');
const db = require('../../database/connection');
const mailSender = require('../../modules/mailSender');

// This function will be imported from model once db is setup
const updateUserToken = (email, token)=>{
    const updateUserQuery = `Update users 
    set resetpasswordtoken = ${token},
    resetPasswordExpires = ${Date.now()+360000}
    where email = \'${email}\'`;

    db.query(updateUserQuery, (err, result) => {
        if (err) throw new Error(err.message);
        else {
            console.log(`User with email ${email} updated successfuly`);
        }
    });
};

router.get('/', (req, res) => {
    res.send('forgot password screen');
});

// gets called when the person submits the forgot password button
router.post('/', (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).send("No email was defined");
    }
    db.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
        const user = result.rows[0];
        if (err) res.status(500).send(err);
        else if (!user) {
            return res.status(404).send(`There is no user with email ${email}`);
        }
        // generate 6 digit code
        const token = randomize('0', 6);
        try {
            // update the db
            updateUserToken(email, token);
            // send the email
            mailSender.sendToken(email, token);
        } catch (error) {
            return res.status(500).send(err);
        }
        res.status(200).send("Code sent successfully to " + email);
    });
});

// gets called when user writes in the token they recieved and click submit
router.post('/confirm', (req, res) => {
    const tokenRecieved = req.body.token;
    const email = req.body.email;
    if (!tokenRecieved && !email) {
        return res.status(400).send("Token and email not defined");
    } else if (!email) return res.status(400).send("Email not defined");
    else if (!tokenRecieved) return res.status(400).send("Token not defined");
    db.query('SELECT resetpasswordtoken,resetpasswordexpires FROM users WHERE email = $1', [email], (err, result) => {
        if (err) return res.status(500).send(err);
        else if (result.rows.length == 0) {
            return res.status(400).send("There is no user with that email");
        }
        const tokenSent = result.rows[0].resetpasswordtoken;
        const expiryTime = result.rows[0].resetpasswordexpires;
        if (tokenSent === tokenRecieved && Date.now()<=expiryTime) {
            res.status(200).send("Token is accepted");
        } else if (tokenSent != tokenRecieved) {
            res.status(401).send("Tokens did not match");
        } else {
            res.status(401).send("Token expired");
        }
    });
});

module.exports = router;
