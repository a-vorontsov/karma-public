/**
 * @module Causes
 */
const log = require("../../util/log");
const express = require('express');
const router = express.Router();
const causeRepository = require("../../repositories/cause");
const authService = require("../../modules/authentication/");
const httpUtil = require("../../util/http");

/**
 * Gets all causes.<br/>
 <p><b>Route: </b>/causes (GET)</p>
 <p><b>Permissions: </b>any</p>
 * @returns
 *  status: 200, description: Array of all cause objects<br/>
 *  status: 500, description: Most probably a database error occurred
 *  @name Get all causes
 *  @function
 */
router.get('/', authService.acceptAnyAuthentication, async (req, res) => {
    try {
        log.info("%s: Getting all causes", req.query.userId ? `User id '${req.query.userId}'` : "No auth");
        const allCausesResult = await causeRepository.findAll();
        const causes = allCausesResult.rows;
        res.status(200).send({data: causes});
    } catch (e) {
        log.error("%s: Getting all causes failed", req.query.userId ? `User id '${req.query.userId}'` : "No auth");
        httpUtil.sendGenericError(e, res);
    }
});

/**
 * Gets a cause specified by id.<br/>
 <p><b>Route: </b>/causes/:id (GET)</p>
 <p><b>Permissions: </b>any</p>
 * @param {number} req.params.id - ID of the cause required
 * @returns
 *  status: 200, description: cause object with given id <br/>
 *  status: 400, description: if ID param is not specified or in wrong format/NaN <br/>
 *  status: 400, description: no cause was found in DB with ID <br/>
 *  status: 500, description: Most probably a database error occurred
 *  @name Get by ID
 *  @function
 */
router.get('/:id', authService.acceptAnyAuthentication, async (req, res) => {
    try {
        const id = req.params.id;
        log.info("%s: Getting cause id '%d'", req.query.userId ? `User id '${req.query.userId}'` : "No auth", id);

        /* istanbul ignore if */
        if (!id) return res.status(400).send("No id was specified");
        if (isNaN(id)) return res.status(400).send("ID specified is in wrong format");

        const findCauseResult = await causeRepository.findById(id);
        const cause = findCauseResult.rows;
        if (cause.length === 0) {
            return httpUtil.sendResult({
                status: 400,
                message: "No cause with given id",
                data: {},
            }, res);
        }
        res.status(200).send({data: cause});
    } catch (e) {
        log.error("%s: Getting cause id '%d' failed", req.query.userId ? `User id '${req.query.userId}'` : "No auth", req.params.id);
        httpUtil.sendGenericError(e, res);
    }
});


module.exports = router;
