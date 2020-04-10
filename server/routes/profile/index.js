/**
 * @module Profile
 */
const log = require("../../util/log");
const express = require("express");
const router = express.Router();
const authService = require("../../modules/authentication/");
const userRepo = require("../../repositories/user");
const indivRepo = require("../../repositories/individual");
const orgRepo = require("../../repositories/organisation");
const addressRepo = require("../../repositories/address");
const profileRepo = require("../../repositories/profile");
const selectedCauseRepo = require("../../repositories/cause/selected");
const signUpRepo = require("../../repositories/event/signup");
const eventRepo = require("../../repositories/event");
const eventSorter = require("../../modules/sorting");

/**
 * Endpoint called whenever a user wishes to get their own or another user's profile.<br/>
 * If otherUserId is undefined the current user's id derived from the authToken will be used.<br/>
 <p><b>Route: </b>/profile (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {string} req.query.otherUserId another user's ID whose profile the active user wishes to view OR undefined
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
                    "id": 2,
                    "name": "Pathways to Collective and Individual Healing",
                    "addressId": 2,
                    "womenOnly": false,
                    "spots": 20,
                    "addressVisible": true,
                    "minimumAge": 21,
                    "photoId": false,
                    "physical": false,
                    "addInfo": false,
                    "content": "This symposium aims to share research and studies with professionals and
                    researchers working within the CSA/ sexual abuse space (therapists, heath care professionals,
                    charity sector) to unpack context of working within the South Asian community, with an objective
                    of informing practice and sharing cultural sensitive/adaptive approaches.",
                    "date": "2020-07-04T23:00:00.000Z",
                    "userId": 1,
                    "pictureId": null,
                    "creationDate": "2019-09-17T23:00:00.000Z",
                    "favourited": true,
                    "volunteers": [
                        51,
                        61,
                        62,
                        70,
                        73,
                        78,
                        85,
                        86,
                        88,
                        95,
                        98,
                        100
                    ],
                    "causes": [
                        4
                    ],
                    "spotsRemaining": 8,
                    "going": true
                    }
                 ],
                 "pastEvents": [
                    {
                    "id": 31,
                    "name": "ante,",
                    "addressId": 4,
                    "womenOnly": false,
                    "spots": 49,
                    "addressVisible": false,
                    "minimumAge": 20,
                    "photoId": true,
                    "physical": false,
                    "addInfo": false,
                    "content": "amet, consectetuer adipiscing elit. Etiam laoreet, libero et tristique pellentesque.",
                    "date": "2019-08-02T23:00:00.000Z",
                    "userId": 75,
                    "pictureId": null,
                    "creationDate": "2020-01-13T00:00:00.000Z",
                    "favourited": false,
                    "volunteers": [
                        52,
                        100
                    ],
                    "causes": [
                        7
                    ],
                    "spotsRemaining": 47,
                    "going": true
                     },
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
router.get("/", authService.requireAuthentication, async (req, res) => {
    try {
        // set userId according to whose profile is to be viewed
        const userId = req.query.otherUserId !== undefined ? req.query.otherUserId : req.query.userId;
        log.info("User id '%d': Getting profile data for user id '%d'", req.query.userId, userId);
        const now = new Date();
        const userResult = await userRepo.findById(userId);
        const user = userResult.rows[0];
        const userToSend = {
            username: user.username,
            email: user.email,
        };
        const createdEventsResult = await eventRepo.findAllByUserIdWithLocation(userId);
        const createdEvents = await Promise.all(createdEventsResult.rows.filter(event => event.date > now));
        eventSorter.sortByTime(createdEvents);
        const createdPastEvents = await Promise.all(createdEventsResult.rows.filter(event => event.date < now));
        eventSorter.sortByTime(createdPastEvents);
        const causeResult = await selectedCauseRepo.findByUserId(userId);
        const causes = causeResult.rows;
        const indivResult = await indivRepo.findByUserID(userId);
        // send appropriate profile
        if (indivResult.rows.length === 1) {
            const individual = indivResult.rows[0];
            const addressResult = await addressRepo.findById(individual.addressId);
            const address = addressResult.rows[0];
            const profileResult = await profileRepo.findByIndividualId(individual.id);
            const profile = profileResult.rows[0];
            const signUpResult = await signUpRepo.findAllByIndividualIdConfirmed(individual.id);

            const pastEvents = (await Promise.all(signUpResult.rows.map(signup => signup.eventId)
                .map(eventId => eventRepo.findById(eventId))))
                .map(eventResult => eventResult.rows[0])
                .map(event => {
                    return {
                        ...event,
                        spotsRemaining: event.spots - (event.volunteers).length,
                        going: true,
                        favourited: (event.favourited).includes(Number.parseInt(userId)),
                    };
                })
                .filter(event => event.date < now);
            eventSorter.sortByTime(pastEvents);
            const upcomingEvents = (await Promise.all(signUpResult.rows.map(signup => signup.eventId)
                .map(eventId => eventRepo.findById(eventId))))
                .map(eventResult => eventResult.rows[0])
                .map(event => {
                    return {
                        ...event,
                        spotsRemaining: event.spots - (event.volunteers).length,
                        going: true,
                        favourited: (event.favourited).includes(Number.parseInt(userId)),
                    };
                })
                .filter(event => event.date > now);
            eventSorter.sortByTime(upcomingEvents);

            const indivToSend = {
                registrationDate: user.dateRegistered,
                firstName: individual.firstname,
                lastName: individual.lastname,
                dateOfBirth: individual.birthday,
                gender: individual.gender,
                phoneNumber: individual.phone,
                banned: individual.banned,
                pictureId: individual.pictureId,
                bio: profile.bio,
                karmaPoints: profile.karmaPoints,
                pictureId: individual.pictureId,
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
            const orgResult = await orgRepo.findByUserID(userId);
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
                pictureId: organisation.pictureId,
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
        log.error("User id '%d': Failed getting profile data for user id '%d': " + e, req.query.userId,
            req.query.otherUserId !== undefined ? req.query.otherUserId : req.query.userId);
        res.status(400).send({
            message: e.message,
        });
    }
});

module.exports = router;
