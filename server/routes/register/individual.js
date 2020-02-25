const express = require("express");
const router = express.Router();
const userAgent = require("../../modules/authentication/user-agent");

/**
 * This is the fourth step of the signup flow (after user
 * registration and selection of individual reg).
 * The user inputs their formal name, address, DOB,
 * address, gender as well as their phone number.
 * The HTTP request object must also contain the user's ID
 * number for identification.
 * A HTTP response is generated based on the outcome of the
 * operation.
 * @route {POST} /register/individual
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {integer} userId
 * @param {string} title //TODO: string?
 * @param {string} firstName
 * @param {string} middleNames
 * @param {string} surName
 * @param {Date} dateOfBirth
 * @param {string} gender //TODO: string?
 * @param {string} addressLine1
 * @param {string} addressLine2
 * @param {string} townCity
 * @param {string} countryState
 * @param {string} postCode
 * @param {string} phoneNumber
 * @return {HTTP} one of the following HTTP responses
 * - if success, 200 - individual registration successful
 * - if registration failed, 400 - error == exception
 */
router.post("/", async (req, res) => {
    try {
        userAgent.registerIndividual(
            req.body.userId,
            req.body.title,
            req.body.firstName,
            req.body.middleNames,
            req.body.surName,
            req.body.dateOfBirth,
            req.body.gender,
            req.body.addressLine1,
            req.body.addressLine2,
            req.body.townCity,
            req.body.countryState,
            req.body.postCode,
            req.body.phoneNumber,
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
