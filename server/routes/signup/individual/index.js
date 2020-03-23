/**
 * @module Sign-up-Individual
 */

const log = require("../../../util/log");
const express = require("express");
const router = express.Router();
const userAgent = require("../../../modules/authentication/user-agent");
const authAgent = require("../../../modules/authentication/auth-agent");

/**
 * This is the fourth step of the signup flow (after user
 * registration and selection of individual reg).
 * The user inputs their formal name, address, DOB,
 * address, gender as well as their phone number.<br/>
 * The HTTP request object must also contain the user's ID
 * number for identification.<br/>
 * A HTTP response is generated based on the outcome of the
 * operation.
 <p><b>Route: </b>/signup/individual (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
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
                [...]
                address: {
                    "addressLine1": "7 Queen Lane",
                    "postCode": "WC 123",
                    [...]
                }
            &#125;
        &#125;
    &#125;
</code></pre>
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if success, 200 - individual registration successful<br/>
 * - if registration failed, 400 - error == exception
 * @name Sign-up Individual
 * @function
 */
router.post("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        log.info("Signing up individual");
        const individual = {
            title: req.body.data.individual.title,
            firstName: req.body.data.individual.firstName,
            lastName: req.body.data.individual.lastName,
            dateOfBirth: req.body.data.individual.dateOfBirth,
            gender: req.body.data.individual.gender,
            address: {
                addressLine1: req.body.data.individual.address.addressLine1,
                addressLine2: req.body.data.individual.address.addressLine2,
                townCity: req.body.data.individual.address.townCity,
                countryState: req.body.data.individual.address.countryState,
                postCode: req.body.data.individual.address.postCode,
            },
            phoneNumber: req.body.data.individual.phoneNumber,
        };
        await userAgent.registerIndividual(
            req.body.userId,
            individual,
        );
        res.status(200).send({
            message: "Individual registration successful.",
        });
    } catch (e) {
        log.error("Signing up individual failed: " + e);
        res.status(400).send({
            message: e.message,
        });
    }
});

module.exports = router;
