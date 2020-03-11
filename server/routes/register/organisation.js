/**
 * @module Register-organisation
 */

const express = require("express");
const router = express.Router();
const userAgent = require("../../modules/authentication/user-agent");

/**
 * This is the fourth step of the signup flow (after user
 * registration and selection of organisation reg).
 * The user inputs the organisation's official number,
 * formal name, address and a phone number.<br/>
 * The HTTP request object must also contain the user's ID
 * number for identification and a valid authToken for
 * authentication.<br/>
 * A HTTP response is generated based on the outcome of the
 * operation.
 * @route {POST} /register/organisation
 * @param {number} req.body.userId the user's id, as in every request
 * @param {string} req.body.authToken the user's valid authToken, as in every request
 * @param {object} req.body.data.organisation the user input values for their profile
 * @param {object} req.body Here is an example of an appropriate request json:
 <pre><code>
    &#123;
        "userId": 123,
        "authToken": "secureToken",
        "data": &#123;
            "organisation": &#123;
                "name": "WWF",
                "organisationNumber": "123",
                "phoneNumber": "0723423423",
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
 * - if success, 200 - organisation registration successful<br/>
 * - if registration failed, 400 - error == exception
 * @name Register organisation
 * @function
 */
router.post("/", async (req, res) => {
    try {
        const organisation = {
            organisationNumber: req.body.data.organisation.organisationNumber,
            name: req.body.data.organisation.name,
            organisationType: req.body.data.organisation.organisationType,
            lowIncome: req.body.data.organisation.lowIncome,
            exempt: req.body.data.organisation.exempt,
            pocFirstName: req.body.data.organisation.pocFirstName,
            pocLastName: req.body.data.organisation.pocLastName,
            address: {
                addressLine1: req.body.data.organisation.address.addressLine1,
                addressLine2: req.body.data.organisation.address.addressLine2,
                townCity: req.body.data.organisation.address.townCity,
                countryState: req.body.data.organisation.address.countryState,
                postCode: req.body.data.organisation.address.postCode,
            },
            phoneNumber: req.body.data.organisation.phoneNumber,
        };
        await userAgent.registerOrg(
            req.body.userId,
            organisation,
        );
        res.status(200).send({
            message: "Organisation registration successful.",
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
        });
    }
});

module.exports = router;
