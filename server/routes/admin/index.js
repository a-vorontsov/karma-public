/**
 * @module Admin
 */

const express = require("express");
const router = express.Router();

const httpUtil = require("../../util/httpUtil");
const userRepository = require("../../models/databaseRepositories/userRepository");
const individualRepository = require("../../models/databaseRepositories/individualRepository");
const deletionModule = require("../../modules/deletion");

/**
 * This fetches all users.
 */
router.get("/users", async (req, res) => {
    try {
        const users = await userRepository.findAll();
        return httpUtil.sendResult({status: 200, data: {users: users.rows}}, res);
    } catch (e) {
        console.log("Information creation failed: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * This deletes a user and all information.
 * Example: POST localhost:8000/admin/user/delete?userId=2
 */
router.post("/user/delete", async (req, res) => {
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
 */
router.get("/individuals", async (req, res) => {
    try {
        const individuals = await individualRepository.findAll();
        return httpUtil.sendResult({status: 200, data: {individuals: individuals.rows}}, res);
    } catch (e) {
        console.log("Information creation failed: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});


module.exports = router;
