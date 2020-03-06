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
 * formal name, address and a phone number.
 * The HTTP request object must also contain the user's ID
 * number for identification.
 * A HTTP response is generated based on the outcome of the
 * operation.
 * @route {POST} /register/organisation
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {integer} userId
 * @param {string} organisationNumber //TODO: string?
 * @param {string} name
 * @param {string} addressLine1
 * @param {string} addressLine2
 * @param {string} organisationType
 * @param {string} lowIncome
 * @param {string} exempt
 * @param {string} pocFirstName
 * @param {string} pocLastName
 * @param {string} townCity
 * @param {string} countryState
 * @param {string} postCode
 * @param {string} phoneNumber
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if success, 200 - organisation registration successful<br/>
 * - if registration failed, 400 - error == exception
 * @name Register organisation
 * @function
 */
router.post("/", async (req, res) => {
    try {
        await userAgent.registerOrg(
            req.body.userId,
            req.body.organisationNumber,
            req.body.name,
            req.body.addressLine1,
            req.body.addressLine2,
            req.body.organisationType,
            req.body.lowIncome,
            req.body.exempt,
            req.body.pocFirstName,
            req.body.pocLastName,
            req.body.townCity,
            req.body.countryState,
            req.body.postCode,
            req.body.phoneNumber,
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
