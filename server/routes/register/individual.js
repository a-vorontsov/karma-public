/**
 * @module Register-individual
 */

const express = require("express");
const router = express.Router();
const userAgent = require("../../modules/authentication/user-agent");

/**
 * This is the fourth step of the signup flow (after user
 * registration and selection of individual reg).
 * The user inputs their formal name, address, DOB,
 * address, gender as well as their phone number.<br/>
 * The HTTP request object must also contain the user's ID
 * number for identification.<br/>
 * A HTTP response is generated based on the outcome of the
 * operation.
 * @route {POST} /register/individual
 * @param {number} req.body.userId the user's id, as in every request
 * @param {string} req.body.authToken the user's valid authToken, as in every request
 * @param {object} req.body.data.individual the user input values for their profile
 * @param {object} req.body Here is an example of an appropriate request json:
 <pre><code>
    &#123;
        "userId": 123,
        "authToken": "secureToken",
        "data": &#123;
            "individual": &#123;
                "title": "Mr.",
                "firstName": "Paul",
                "lastName": "Test",
                "addressLine1" "7 Queen Lane",
                [...]
            &#125;
        &#125;
    &#125;
</code></pre>
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if success, 200 - individual registration successful<br/>
 * - if registration failed, 400 - error == exception
 * @name Register individual
 * @function
 */
router.post("/", async (req, res) => {
    try {
        await userAgent.registerIndividual(
            req.body.userId,
            req.body.data.individual.title,
            req.body.data.individual.firstName,
            req.body.data.individual.surName,
            req.body.data.individual.dateOfBirth,
            req.body.data.individual.gender,
            req.body.data.individual.addressLine1,
            req.body.data.individual.addressLine2,
            req.body.data.individual.townCity,
            req.body.data.individual.countryState,
            req.body.data.individual.postCode,
            req.body.data.individual.phoneNumber,
        );
        res.status(200).send({
            message: "Individual registration successful.",
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
        });
    }
});

module.exports = router;
