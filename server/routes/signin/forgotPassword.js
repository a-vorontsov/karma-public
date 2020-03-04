const express = require('express');
const router = express.Router();
const randomize = require('randomatic');
const mailSender = require('../../modules/mailSender');
const userRepository = require("../../models/databaseRepositories/userRepository");
const util = require("../../util/util");

router.get('/', (req, res) => {
    res.send('forgot password screen');
});

// gets called when the person submits the forgot password button
router.post('/', async (req, res) => {
    const email = req.body.email;
    const checkEmailResult = await util.checkEmail(email);
    if (checkEmailResult.status != 200) {
        return res.status(checkEmailResult.status).send(checkEmailResult.message);
    }
    const user = checkEmailResult.user;
    // generate 6 digit code
    const token = randomize('0', 6);
    // update the db
    userRepository.insertResetToken(user.id, token)
        .then(() => mailSender.sendToken(email, token))
        .then(() => res.status(200).send("Code sent successfully to " + email))
        .catch(err => res.status(500).send(err));
});

// gets called when user writes in the token they recieved and click submit
router.post('/confirm', async (req, res) => {
    const tokenRecieved = req.body.token;
    const email = req.body.email;
    const checkEmailResult = await util.checkEmail(email);
    if (checkEmailResult.status != 200) {
        return res.status(checkEmailResult.status).send(checkEmailResult.message);
    }
    if (!tokenRecieved) return res.status(400).send("Token not defined");

    userRepository.findResetToken(checkEmailResult.user.id)
        .then(result => {
            if (result.rows.length == 0) return res.status(400).send("No token sent to " + email);

            const tokenSent = result.rows[0].password_token;
            const expiryDate = result.rows[0].expiry_date;

            if (tokenSent === tokenRecieved && new Date() <= expiryDate) {
                res.status(200).send("Token is accepted");
            } else if (tokenSent != tokenRecieved) {
                res.status(401).send("Tokens did not match");
            } else {
                res.status(401).send("Token expired");
            }
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;
