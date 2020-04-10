/**
 * @module Admin
 */
const log = require("../../util/log");
const express = require("express");
const router = express.Router();

const httpUtil = require("../../util/http");
const deletionModule = require("../../modules/deletion");
const adminService = require("../../modules/admin/");
const validation = require("../../modules/validation");
const authService = require("../../modules/authentication/");

/**
 * Endpoint called whenever an admin requests to see all users.<br/>
 <p><b>Route: </b>/admin/users (GET)</p>
 <p><b>Permissions: </b>require admin permissions</p>
 * @param {string} req.headers.authorization authToken
 * @returns {Object}
 *  status: 200, description: All users signed up to the app.<br/>
 *  status: 500, description: DB error
 *<pre>
 {
    "message": "Users fetched successfully.",
    "data": {
        "users": [
            {
                "id": 7,
                "email": "asd@asd.asd",
                "username": "Sten"
                [...]
            }
            {
                "id": 7,
                "email": "asd@asd.asd",
                "username": "Sten"
                [...]
            }
        ]
    }
 }
 </pre>
 *  @name Get all users
 *  @function
 */
router.get("/users", authService.requireAuthentication, async (req, res) => {
    try {
        log.info("Admin%s: Fetching all users", (req.query.userId ? ` (user id ${req.query.userId})` : ``));
        const usersResult = await adminService.getAllUsers();
        return httpUtil.sendResult(usersResult, res);
    } catch (e) {
        log.error("Admin%s: Users fetching failed: " + e, (req.query.userId ? ` (user id ${req.query.userId})` : ``));
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever an admin requests to delete all information in database for
 * specific user.<br/>
 <p><b>Route: </b>/admin/user/delete?deleteUserId=2 (POST)</p>
 <p><b>Permissions: </b>require admin permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {string} req.query.deleteUserId id of user to be deleted
 * @returns {Object}
 *  status: 200, description: The deleted user.<br/>
 *  status: 500, description: DB error
 *<pre>
 {
    "message": "All User information deleted successfully",
    "data": {
        user: {
          email: 'test@gmail.com',
          username: 'test1',
          passwordHash: 'password',
          verified: true,
          salt: 'password',
          dateRegistered: '2016-06-22 19:10:25-07',
          id: 1
        }
 }
 </pre>
 *  @name Post delete user info
 *  @function
 */
router.post("/user/delete", authService.requireAuthentication, async (req, res) => {
    try {
        const deleteUserId = req.query.deleteUserId;
        log.info("Admin%s: Deleting all user data for user id '%d'",
            (req.query.userId ? ` (user id ${req.query.userId})` : ``), deleteUserId);
        const deletionResult = await deletionModule.deleteAllInformation(deleteUserId);
        return httpUtil.sendResult(deletionResult, res);
    } catch (e) {
        log.error("Admin%s: User id '%d' couldn't be deleted: " + e,
            (req.query.userId ? ` (user id ${req.query.userId})` : ``), req.query.deleteUserId);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * This fetches all individuals.
 * Endpoint called whenever an admin requests to see all individuals.<br/>
 <p><b>Route: </b>/admin/individuals (GET)</p>
 <p><b>Permissions: </b>require admin permissions</p>
 * @param {string} req.headers.authorization authToken
 * @returns {Object}
 *  status: 200, description: All individuals signed up to the app.<br/>
 *  status: 500, description: DB error
 *<pre>
 {
    "message": "Individuals fetched successfully.",
    "data": {
        "individuals": [
            {
                "id": 1,
                "firstname": "Juliet",
                "lastname": "Lowe",
                "phone": "07009 140829",
                "banned": false,
                "userId": 50,
                "pictureId": null,
                "addressId": 18,
                "birthday": "2011-09-22T23:00:00.000Z",
                "gender": "m"
            },
            {
                "id": 2,
                "firstname": "Jocelyn",
                "lastname": "Lancaster",
                "phone": "(016977) 7982",
                "banned": true,
                "userId": 51,
                "pictureId": null,
                "addressId": 35,
                "birthday": "1939-10-25T23:00:00.000Z",
                "gender": "m"
            }
        ]
    }
 }
 </pre>
 *  @name Get all individuals
 *  @function

 */
router.get("/individuals", authService.requireAuthentication, async (req, res) => {
    try {
        log.info("Admin%s: Fetching all individuals", (req.query.userId ? ` (user id ${req.query.userId})` : ``));
        const individualsResult = await adminService.getAllIndividuals();
        return httpUtil.sendResult(individualsResult, res);
    } catch (e) {
        log.error("Admin%s: Individuals fetching failed: " + e, (req.query.userId ? ` (user id ${req.query.userId})` : ``));
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever an admin requests to toggle the ban status of an individual.<br/>
 <p><b>Route: </b>/admin/toggleban (POST)</p>
 <p><b>Permissions: </b>require admin permissions</p>
 * @param {string} req.headers.authorization authToken
 * @returns {Object}
 *  status: 200, description: An object containing the data of the new status of the individual banned/unbanned.<br/>
 *  status: 500, description: DB error
 <pre>
 {
    "message": "Individual ban toggled successfully",
    "data": {
        "individual":
        {
            "id": 1,
            "firstname": "Juliet",
            "lastname": "Lowe",
            "phone": "07009 140829",
            "banned": true,
            "userId": 50,
            "pictureId": null,
            "addressId": 18,
            "birthday": "2011-09-22T23:00:00.000Z",
            "gender": "m"
        }
    }
 }
 </pre>
 *  @name Ban individual
 *  @function
 */
router.post("/toggleBan", authService.requireAuthentication, async (req, res) => {
    try {
        log.info("Admin%s: Toggling ban for user id '%d'",
            (req.query.userId ? ` (user id ${req.query.userId})` : ``), req.body.data.individual.userId);
        const individual = req.body.data.individual;
        const validationResult = validation.validateIndividual(individual);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const bannedIndividualResult = await adminService.toggleIndividualBan(individual);
        return httpUtil.sendResult(bannedIndividualResult, res);
    } catch (e) {
        log.error("Admin%s: Toggling ban for user id '%d' failed: " + e,
            (req.query.userId ? ` (user id ${req.query.userId})` : ``), req.body.data.individual.userId);
        return httpUtil.sendGenericError(e, res);
    }
});


module.exports = router;
