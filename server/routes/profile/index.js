/**
 * @module Profile
 */

const express = require("express");
const router = express.Router();
const authAgent = require("../../modules/authentication/auth-agent");
const userRepo = require("../../models/databaseRepositories/userRepository");
const indivRepo = require("../../models/databaseRepositories/individualRepository");
const orgRepo = require("../../models/databaseRepositories/organisationRepository");
const addressRepo = require("../../models/databaseRepositories/addressRepository");
const profileRepo = require("../../models/databaseRepositories/profileRepository");
const selectedCauseRepo = require("../../models/databaseRepositories/selectedCauseRepository");
const signUpRepo = require("../../models/databaseRepositories/signupRepository");
const eventRepo = require("../../models/databaseRepositories/eventRepository");

/**
 * Endpoint called whenever a user wishes to get their profile.<br/>
 <p><b>Route: </b>/profile (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {Number} req.query.userId - ID of user logged in
 * @param {String} req.body.authToken
 * @returns {object}
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
                "banned": true,
                [...]
                "address:" {
                    "addressLine1": "1 Queen Str.",
                    "postCode": "NW 123",
                    [...]
                }
                 "upcomingEvents": [
                    {
                    "id": 89,
                    "name": "nonummy",
                    "addressId": 35,
                    "womenOnly": true,
                    "spots": 18,
                    "addressVisible": true,
                    "minimumAge": 21,
                    "photoId": true,
                    "physical": true,
                    "addInfo": false,
                    "content": "id, libero. Donectristique neque vs. Etiam bibendum fermentum metus. Aenean",
                    "date": "2020-10-20T23:00:00.000Z",
                    "userId": 80,
                    "creationDate": "2019-11-06T00:00:00.000Z",
                    "causes": [1,2,4]
                    }
                 ],
                 "pastEvents": [
                 {
                    "id": 7,
                    "name": "nec tempus mauris erat",
                    "addressId": 9,
                    "womenOnly": false,
                    "spots": 49,
                    "addressVisible": true,
                    "minimumAge": 19,
                    "photoId": true,
                    "physical": false,
                    "addInfo": true,
                    "content": "frat. Cras dipis nec mauris blandit mattis. Cras eget nisi dictum augue",
                    "date": "2019-07-15T23:00:00.000Z",
                    "userId": 45,
                    "creationDate": "2019-07-06T23:00:00.000Z",
                    "causes": [1,2,4]
                 }
                 {
                    "id": 45,
                    "name": "turpis nec mauris blandit mattis.",
                    "addressId": 68,
                    "womenOnly": true,
                    "spots": 44,
                    "addressVisible": false,
                    "minimumAge": 20,
                    "photoId": true,
                    "physical": true,
                    "addInfo": false,
                    "content": "am vitae Sed nec metus facilisis lorem",
                    "date": "2019-08-19T23:00:00.000Z",
                    "userId": 53,
                    "creationDate": "2020-07-26T23:00:00.000Z",
                    "causes": [1,2,4]
                            }
                 ],
                 "causes": {
                            "userId": 57,
                            "causeId": 12
                        },
                 "createdEvents": [],
                 "createdPastEvents": []
                 }
            &#125;
        &#125;
    &#125;
</code></pre>
 * <br/>This way you can call for example <code class="highlight">req.body.data.individual</code> to get the
 * individual object and all it's visible params. <br/>(this won't include all params of
 * the objects, for instance their password)
 *  @name Get profile
 *  @function
 */
router.get("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        const now = new Date();
        const userResult = await userRepo.findById(req.query.userId);
        const user = userResult.rows[0];
        const userToSend = {
            username: user.username,
            email: user.email,
        };

        const createdEventsResult = await eventRepo.findAllByUserIdWithLocation(req.query.userId);
        const createdEvents = await Promise.all(createdEventsResult.rows.filter(event => event.date > now));
        const createdPastEvents = await Promise.all(createdEventsResult.rows.filter(event => event.date < now));
        const causeResult = await selectedCauseRepo.findByUserId(req.query.userId);
        const causes = causeResult.rows;
        const indivResult = await indivRepo.findByUserID(req.query.userId);
        // send appropriate profile
        if (indivResult.rows.length === 1) {
            const individual = indivResult.rows[0];

            const addressResult = await addressRepo.findById(individual.addressId);
            const address = addressResult.rows[0];

            const profileResult = await profileRepo.findByIndividualId(individual.id);
            const profile = profileResult.rows[0];
            const signUpResult = await signUpRepo.findAllByIndividualId(individual.id);
            const pastEvents = (await Promise.all(signUpResult.rows.map(signup => signup.eventId)
                .map(eventId => eventRepo.findById(eventId))))
                .map(eventResult => eventResult.rows[0])
                .filter(event => event.date < now);
            const upcomingEvents = (await Promise.all(signUpResult.rows.map(signup => signup.eventId)
                .map(eventId => eventRepo.findById(eventId))))
                .map(eventResult => eventResult.rows[0])
                .filter(event => event.date > now);

            const indivToSend = {
                registrationDate: user.dateRegistered,
                firstName: individual.firstname,
                lastName: individual.lastname,
                dateOfBirth: individual.birthday,
                gender: individual.gender,
                phoneNumber: individual.phone,
                banned: individual.banned,
                bio: profile.bio,
                karmaPoints: profile.karmaPoints,
                address: {
                    addressLine1: address.address1,
                    addressLine2: address.address2,
                    townCity: address.city,
                    countryState: address.region,
                    postCode: address.postcode,
                    lat: address.lat,
                    long: address.long,
                },
            };
            res.status(200).send({
                message: "Found individual profile for user.",
                data: {
                    user: userToSend,
                    individual: indivToSend,
                    upcomingEvents,
                    pastEvents,
                    causes,
                    createdEvents,
                    createdPastEvents,
                },
            });
        } else {
            const orgResult = await orgRepo.findByUserID(req.query.userId);
            const organisation = orgResult.rows[0];

            const addressResult = await addressRepo.findById(organisation.addressId);
            const address = addressResult.rows[0];

            const orgToSend = {
                registrationDate: user.dateRegistered,
                organisationNumber: organisation.orgNumber,
                name: organisation.orgName,
                organisationType: organisation.orgType,
                lowIncome: organisation.lowIncome,
                exempt: organisation.exempt,
                pocFirstName: organisation.pocFirstname,
                pocLastName: organisation.pocLastname,
                phoneNumber: organisation.phone,
                banned: organisation.banned,
                address: {
                    addressLine1: address.address1,
                    addressLine2: address.address2,
                    townCity: address.city,
                    countryState: address.region,
                    postCode: address.postcode,
                },
            };
            res.status(200).send({
                message: "Found organisation profile for user.",
                data: {
                    user: userToSend,
                    organisation: orgToSend,
                    causes: causes,
                    createdEvents,
                    createdPastEvents,
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
