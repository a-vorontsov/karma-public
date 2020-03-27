/**
 * @module Picture
 */

const express = require("express");
const router = express.Router();
const authService = require("../../modules/authentication/");

const imgFetch = require("../../modules/picture/fetch");
const imgUpload = require("../../modules/picture/upload");
const imgDelete = require("../../modules/picture/delete");

// == Image upload == //

/**
 * Endpoint called to upload event image by given event ID.<br/>
 * Calling user must be authorised, and be the event creator.<br/>
 * URL example: GET http://localhost:8000/picture/upload/event/20"
 * @param {eventId} the ID of the event to update the picture for
 * @returns {Object}
 * status: 200, description: Success<br/>
 * status: 303, description: Unauthorised to modify this event.<br/>
 * status: 400, description: Invalid event ID was given, or request was malformed.<br/>
 * status: 500, description: Internal server error, database error, or s3 connection problem..<br/>
 *  @name Upload and update event picture by event ID.
 *  @function
 */
router.post("/upload/event/:eventId", authService.requireAuthentication, (req, res) => {
    imgUpload.updateEventPicture(req, res);
});

// == Image Delete == //

/**
 * Endpoint called to delete event image by given event ID.<br/>
 * Calling user must be authorised, and be the event creator.<br/>
 * URL example: GET http://localhost:8000/picture/delete/event/20"
 * @param {eventId} the ID of the event to delete the picture for
 * @returns {Object}
 * status: 200, description: Success<br/>
 * status: 303, description: Unauthorised to modify this event.<br/>
 * status: 400, description: Invalid event ID was given, or request was malformed.<br/>
 * status: 500, description: Internal server error, database error, or s3 connection problem..<br/>
 *  @name Delete event picture by event ID.
 *  @function
 */
router.post("/delete/event/:eventId", authService.requireAuthentication, (req, res) => {
    imgDelete.deleteEventPicture(req, res);
});

// == Image Fetching == //

/**
 * Endpoint called to fetch event image by given event ID.<br/>
 * URL example: GET http://localhost:8000/picture/event/20"
 * @param {eventId} the ID of the event to fetch the picture for
 * @returns {Object}
 * status: 200, description: Success<br/>
 * status: 400, description: Invalid event ID was given, or request was malformed.<br/>
 * status: 500, description: Internal server or database error.<br/>
 *  @name Fetch event picture by event ID.
 *  @function
 */
router.get("/event/:eventId", imgFetch.getEventPicture);

/**
 * Endpoint called to fetch picture by given id.<br/>
 * URL example: GET http://localhost:8000/picture/42"
 * @param {pictureId} the ID of the picture being fetched
 * @returns {Object}
 * status: 200, description: Success<br/>
 * status: 400, description: Invalid pictureId was given, request was malformed, or picture object has no location.<br/>
 * status: 500, description: Internal server or database error.<br/>
 *  @name Fetch image by picture ID.
 *  @function
 */
router.get("/:pictureId", imgFetch.getPicture);

// == File Hosting (i.e. Default Images) == //

/**
 * Endpoint called to fetch default file-not-found image.<br/>
 * URL example: GET http://localhost:8000/picture/default/404
 * @returns {Object}
 * status: 200, description: Success
 *  @name Fetch default photo for when an image is not found
 *  @function
 */
router.get("/default/404", imgFetch.get404Image);

module.exports = router;
