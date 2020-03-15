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
 * URL example: GET http://localhost:8000/profile/
 * @param {number} req.body.userId
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
        const userResult = await userRepo.findById(req.body.userId);
        const user = userResult.rows[0];
        const userToSend = {
            username: user.username,
            email: user.email,
        };

        const createdEventsResult = await eventRepo.findAllByUserId(req.body.userId);
        const createdEvents = await Promise.all(createdEventsResult.rows.filter(event => event.date > now));
        const createdPastEvents = await Promise.all(createdEventsResult.rows.filter(event => event.date < now));
        const causeResult = await selectedCauseRepo.findByUserId(req.body.userId);
        const causes = causeResult.rows[0];
        const indivResult = await indivRepo.findByUserID(req.body.userId);
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
            const orgResult = await orgRepo.findByUserID(req.body.userId);
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
                    individual: orgToSend,
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
