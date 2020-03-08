/**
 * @module View-profile
 */

const express = require("express");
const router = express.Router();
const authAgent = require("../../modules/authentication/auth-agent");
const userRepo = require("../../models/databaseRepositories/userRepository");
const indivRepo = require("../../models/databaseRepositories/individualRepository");
const orgRepo = require("../../models/databaseRepositories/organisationRepository");
const addressRepo = require("../../models/databaseRepositories/addressRepository");

/**
 * Endpoint called whenever a user wishes to view their profile.<br/>
 * URL example: GET http://localhost:8000/profile/view/
 * @param {Integer} req.body.userId
 * @param {String} req.body.authToken
 * @returns
 * status: 400, description: error - for example an undefined indicating missing profile <br/>
 * status: 200, description: A message variable stating successfully
 * finding the user's individual or organisation profile, as well as,<br/>
 * a user AND either an individual OR an organisation object in the data json. <br/>
 * Here is an example return json on success:
<pre><code>
    &#123;
        "message": "Found individual profile for user.",
        "data:" &#123;
            "user:" &#123;
                "username": "Paul",
                "email": "paul&#64;karma.com"
            &#125;
            "individual:" &#123;
                "firstName": "Paul",
                "addressLine1": "1 Queen Str.",
                "banned": true,
                [...]
            &#125;
        &#125;
    &#125;
</code></pre>
 * <br/>This way you can call for example <code class="highlight">req.body.data.individual</code> to get the
 * individual object and all it's visible params. <br/>(this won't include all params of
 * the objects, for instance their password)
 *  @name View profile
 *  @function
 */
router.get("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        const userResult = await userRepo.findById(req.body.userId);
        const user = userResult.rows[0];
        const userToSend = {
            username: user.username,
            email: user.email,
        };
        const indivResult = await indivRepo.findByUserID(req.body.userId);
        // send appropriate profile
        if (indivResult.rows.length === 1) {
            const individual = indivResult.rows[0];

            const addressResult = await addressRepo.findById(individual.address_id);
            const address = addressResult.rows[0];

            const indivToSend = {
                registrationDate: user.date_registered,
                firstName: individual.firstname,
                middleNames: "TODO:",
                surName: individual.lastname,
                dateOfBirth: individual.birthday,
                gender: individual.gender,
                addressLine1: address.address_1,
                addressLine2: address.address_2,
                townCity: address.city,
                countryState: address.region,
                postCode: address.postcode,
                phoneNumber: individual.phone,
                banned: individual.banned,
            };
            res.status(200).send({
                message: "Found individual profile for user.",
                data: {
                    user: userToSend,
                    individual: indivToSend,
                },
            });
        } else {
            const orgResult = await orgRepo.findByUserID(req.body.userId);
            const organisation = orgResult.rows[0];

            const addressResult = await addressRepo.findById(organisation.address_id);
            const address = addressResult.rows[0];

            const orgToSend = {
                registrationDate: user.date_registered,
                organisationNumber: organisation.org_number,
                name: organisation.org_name,
                organisationType: organisation.org_type,
                lowIncome: organisation.low_income,
                exempt: organisation.exempt,
                pocFirstName: organisation.poc_firstname,
                pocLastName: organisation.poc_lastname,
                addressLine1: address.address_1,
                addressLine2: address.address_2,
                townCity: address.city,
                countryState: address.region,
                postCode: address.postcode,
                phoneNumber: organisation.phone,
                banned: organisation.banned,
            };
            res.status(200).send({
                message: "Found organisation profile for user.",
                data: {
                    user: userToSend,
                    individual: orgToSend,
                },
            });
        }
    } catch (e) {
        res.status(400).send({
            message: e.message,
        });
    }
});

module.exports = router;
