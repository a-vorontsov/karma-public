/**
 * @module Profile-Edit
 */

const express = require("express");
const router = express.Router();
const authAgent = require("../../../modules/authentication/auth-agent");
const userRepo = require("../../../models/databaseRepositories/userRepository");
const indivRepo = require("../../../models/databaseRepositories/individualRepository");
const orgRepo = require("../../../models/databaseRepositories/organisationRepository");
const addressRepo = require("../../../models/databaseRepositories/addressRepository");

/**
 * Endpoint called whenever a user wishes to update their profile.<br/>
 * Any data that does not need to be updated can and should be
 * left out from the POST request to avoid unnecessary computation.<br/>
 * URL example: POST http://localhost:8000/profile/edit/
 * @param {number} req.body.userId the user's id, as in every request
 * @param {string} req.body.authToken the user's valid authToken, as in every request
 * @param {object} req.body.data.user if anything for user has changed
 * @param {object} req.body.data.individual if anything for indiv prof has changed
 * @param {object} req.body.data.organisation if anything for org prof has changed
 * @param {object} req.body Here are some examples of an appropriate request json:
<pre><code>
    // example 1 (user wishes to change username, phoneNumber)
    &#123;
        "userId": 123,
        "authToken": "secureToken",
        "data": &#123;
            "user": &#123;
                "username": "newUserName",
            &#125;
            "individual": &#123;
                "phoneNumber": "newPhoneNumber",
            &#125;
        &#125;
    &#125;
    // if this is all that the user changed, only send this much

    // example 2 (org moved HQ)
    &#123;
        "userId": 123,
        "authToken": "secureToken",
        "data": &#123;
            "organisation": &#123;
                "phoneNumber": "newLandlineNo.",
                "address:" {
                    "addressLine1": "newAddressLine1",
                    "postCode": "newPostCode",
                }
            &#125;
        &#125;
    &#125;
    // if city/country did not change, this is all that needs to be sent
</code></pre>
 * @returns {object}
 *  status: 200, description: Success, go to view profile endpoint to GET updated record.<br/>
 *  status: 500, description: error <br/><br/><br/><br/>
 *  @name Edit profile
 *  @function
 */
router.post("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        // update user profile if specified in request
        if (req.body.data.user !== undefined) {
            await userRepo.updateUsername(req.body.userId, req.body.data.user.username);
        }
        // update individual OR organisation profile if specified in request
        if (req.body.data.individual !== undefined) {
            const indivResult = await indivRepo.findByUserID(req.body.userId);
            const individual = indivResult.rows[0];
            const indivCopy = {...individual};

            const addressResult = await addressRepo.findById(individual.addressId);
            await updateAddress(req.body.data.individual.address, addressResult.rows[0]);

            if (req.body.data.individual.firstName !== undefined) {
                individual.firstname = req.body.data.individual.firstName;
            }
            if (req.body.data.individual.lastName !== undefined) {
                individual.lastname = req.body.data.individual.lastName;
            }
            if (req.body.data.individual.phoneNumber !== undefined) {
                individual.phone = req.body.data.individual.phoneNumber;
            }
            if (req.body.data.individual.gender !== undefined) {
                individual.gender = req.body.data.individual.gender;
            }

            if (individual !== indivCopy) {
                await indivRepo.update(individual);
            }
        } else if (req.body.data.organisation !== undefined) {
            const orgResult = await orgRepo.findByUserID(req.body.userId);
            const organisation = orgResult.rows[0];
            const orgCopy = {...organisation};

            const addressResult = await addressRepo.findById(organisation.addressId);
            await updateAddress(req.body.data.organisation.address, addressResult.rows[0]);

            if (req.body.data.organisation.name !== undefined) {
                organisation.orgName = req.body.data.organisation.name;
            }
            if (req.body.data.organisation.organisationNumber !== undefined) {
                organisation.orgNumber = req.body.data.organisation.organisationNumber;
            }
            if (req.body.data.organisation.organisationType !== undefined) {
                organisation.orgType = req.body.data.organisation.organisationType;
            }
            if (req.body.data.organisation.pocFirstName !== undefined) {
                organisation.pocFirstname = req.body.data.organisation.pocFirstName;
            }
            if (req.body.data.organisation.pocLastName !== undefined) {
                organisation.pocLastname = req.body.data.organisation.pocLastName;
            }
            if (req.body.data.organisation.phoneNumber !== undefined) {
                organisation.phone = req.body.data.organisation.phoneNumber;
            }
            if (req.body.data.organisation.lowIncome !== undefined) {
                organisation.lowIncome = req.body.data.organisation.lowIncome;
            }
            if (req.body.data.organisation.exempt !== undefined) {
                organisation.exempt = req.body.data.organisation.exempt;
            }

            if (organisation !== orgCopy) {
                await orgRepo.update(organisation);
            }
        }
        res.status(200).send({
            message: "Operation successful. Please GET the view profile endpoint to see the updated profile record.",
        });
    } catch (e) {
        res.status(500).send({
            message: e.message,
        });
    }
});

/**
 * Update address if any update params are specified
 * in request object.
 * @param {Object} profile individual or organisation object in request
 * @param {Object} address
 */
async function updateAddress(profile, address) {
    const addressObj = {...address};

    if (profile.addressLine1 !== undefined ) {
        addressObj.address1 = profile.addressLine1;
    }
    if (profile.addressLine2 !== undefined ) {
        addressObj.address2 = profile.addressLine2;
    }
    if (profile.postCode !== undefined ) {
        addressObj.postcode = profile.postCode;
    }
    if (profile.townCity !== undefined ) {
        addressObj.city = profile.townCity;
    }
    if (profile.countryState !== undefined ) {
        addressObj.region = profile.countryState;
    }

    if (addressObj !== address) {
        await addressRepo.update(addressObj);
    }
}

module.exports = router;

