/**
 * @module Admin
 */

const express = require("express");
const router = express.Router();

const httpUtil = require("../../util/httpUtil");
const deletionModule = require("../../modules/deletion");
const adminService = require("../../modules/admin/adminService");
const validation = require("../../modules/validation");
const authAgent = require("../../modules/authentication/auth-agent");

/**
 * Endpoint called whenever an admin requests to see all users.<br/>
 <p><b>Route: </b>/admin/users (GET)</p>
 <p><b>Permissions: </b>require admin permissions</p>
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
router.get("/users", authAgent.requireAuthentication, async (req, res) => {
    try {
        const usersResult = await adminService.getAllUsers();
        return httpUtil.sendResult(usersResult, res);
    } catch (e) {
        console.log("Users fetching failed: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever an admin requests to delete all information in database for
 * specific user.<br/>
 <p><b>Route: </b>/admin/user/delete?userId=2 (POST)</p>
 <p><b>Permissions: </b>require admin permissions</p>
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
router.post("/user/delete", authAgent.requireAuthentication, async (req, res) => {
    try {
        const userId = req.query.userId;
        const deletionResult = await deletionModule.deleteAllInformation(userId);
        return httpUtil.sendResult(deletionResult, res);
    } catch (e) {
        console.log("User couldn't be deleted: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * This fetches all individuals.
 * Endpoint called whenever an admin requests to see all individuals.<br/>
 <p><b>Route: </b>/admin/individuals (GET)</p>
 <p><b>Permissions: </b>require admin permissions</p>
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
router.get("/individuals", authAgent.requireAuthentication, async (req, res) => {
    try {
        const individualsResult = await adminService.getAllIndividuals();
        return httpUtil.sendResult(individualsResult, res);
    } catch (e) {
        console.log("Individuals fetching failed: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever an admin requests to toggle the ban status of an individual.<br/>
 <p><b>Route: </b>/admin/toggleban (POST)</p>
 <p><b>Permissions: </b>require admin permissions</p>
 * @returns {Object}
 *  status: 200, description: An object containing the data of the new status of the individual banned/unbanned.<br/>
 *  status: 500, description: DB error
 *<pre>
 {
    "message": "Individuals fetched successfully.",
    "data": {
        "individual":
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
        }
    }
 }
 </pre>
 *  @name Ban individual
 *  @function
 */
router.post("/toggleBan", authAgent.requireAuthentication, async (req, res) => {
    try {
        const individual = req.body.data.individual;
        const validationResult = validation.validateIndividual(individual);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const bannedIndividualResult = await adminService.toggleIndividualBan(individual);
        return httpUtil.sendResult(bannedIndividualResult, res);
    } catch (e) {
        console.log("Banning individual failed: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});


module.exports = router;
