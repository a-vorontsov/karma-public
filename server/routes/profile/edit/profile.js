/**
 * @module Edit-profile
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
 * @param {Integer} req.body.userId
 * @param {boolean} req.body.isIndividual please specify true if the user is an indiv, otherwise set to false
 * @param {any} req.body.valueToBeChanged a value / variable that's to be changed on the user's profile<br/>
 * Here are some examples of an appropriate request json:
<pre>
    // example 1 (user wishes to change username, phoneNumber)
  [
    "userId": 123,
    "authToken": "secureToken",
    "isIndividual": true,
    "username": "newUserName",
    "phoneNumber": "newPhoneNumber",
  ]
    // if this is all that the user changed, only send this much

    // example 2 (org moved HQ)
  [
    "userId": 123,
    "authToken": "secureToken",
    "isIndividual": false,
    "phoneNumber": "newPhoneNumber",
    "addressLine1": "newAddressLine1",
    "postCode": "newPostCode",
  ]
    // if city/country did not change, this is all that needs to be sent
</pre>
 * @returns
 *  status: 200, description: Success, go to view profile endpoint to GET updated record.<br/>
 *  status: 500, description: error <br/><br/><br/><br/>
 *  @name Edit profile
 *  @function
 */
router.post("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        if (req.body.username !== undefined) {
            await userRepo.updateUsername(req.body.userId, req.body.username);
        }
        // update individual / organisation profile
        if (req.body.isIndividual === true) {
            const indivResult = await indivRepo.findByUserID(req.body.userId);
            const individual = indivResult.rows[0];
            const indivCopy = {...individual};

            const addressResult = await addressRepo.findById(individual.address_id);
            await updateAddress(req, addressResult.rows[0]);

            if (req.body.firstName === undefined) {
                individual.firstname = req.body.firstName;
            }
            if (req.body.surName === undefined) {
                individual.lastname = req.body.surName;
            }
            if (req.body.phoneNumber === undefined) {
                individual.phone = req.body.phoneNumber;
            }
            if (req.body.gender === undefined) {
                individual.gender = req.body.gender;
            }

            if (individual !== indivCopy) {
                await indivRepo.update(individual);
            }
        } else {
            const orgResult = await orgRepo.findByUserID(req.body.userId);
            const organisation = orgResult.rows[0];
            const orgCopy = {...organisation};

            const addressResult = await addressRepo.findById(organisation.address_id);
            await updateAddress(req, addressResult.rows[0]);

            if (req.body.name === undefined) {
                organisation.org_name = req.body.name;
            }
            if (req.body.organisationNumber === undefined) {
                organisation.org_number = req.body.organisationNumber;
            }
            if (req.body.organisationType === undefined) {
                organisation.org_type = req.body.organisationType;
            }
            if (req.body.pocFirstName === undefined) {
                organisation.poc_firstname = req.body.pocFirstName;
            }
            if (req.body.pocLastName === undefined) {
                organisation.poc_lastname = req.body.pocLastName;
            }
            if (req.body.phoneNumber === undefined) {
                organisation.phone = req.body.phoneNumber;
            }
            if (req.body.lowIncome === undefined) {
                organisation.low_income = req.body.lowIncome;
            }
            if (req.body.exempt === undefined) {
                organisation.exempt = req.body.exempt;
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
 * @param {Object} req
 * @param {Object} address
 */
async function updateAddress(req, address) {
    const addressObj = {...address};
    if (req.body.addressLine1 === undefined) {
        addressObj.address_1 = req.body.addressLine1;
    }
    if (req.body.addressLine2 === undefined) {
        addressObj.address_2 = req.body.addressLine2;
    }
    if (req.body.postCode === undefined) {
        addressObj.postcode = req.body.postCode;
    }
    if (req.body.townCity === undefined) {
        addressObj.city = req.body.townCity;
    }
    if (req.body.countryState === undefined) {
        addressObj.region = req.body.countryState;
    }

    if (addressObj !== address) {
        await addressRepo.update(addressObj);
    }
}

module.exports = router;
