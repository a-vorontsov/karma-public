/**
 * @module Avatar
 */

const express = require("express");
const router = express.Router();
const authService = require("../../modules/authentication");

const imgFetch = require("../../modules/picture/fetch");
const imgUpload = require("../../modules/picture/upload");
const imgDelete = require("../../modules/picture/delete");

/*
 * Handling for fetching, uploading and deleting pictures, e.g. event and profile photos (avatar)
 */

/**
 * Endpoint called to upload & update profile pictures for an individual or organisation or o.<br/>
 * URL example: POST http://localhost:8000/avatar/upload/individual
 * <p><b>Route: </b>/avatar/upload/:userType (POST)</p>
 * <p><b>Permissions: </b>require user permissions</p>
 * The image will be resized to 500x500 automatically, and the URL added to the `picture` table.<br/>
 * Valid file types: jpg, jpeg, png<br/>
 * @param {userId} user ID for the user from auth
 * @param {userType} must be one of individual, organisation
 * @param {req} multipart form-data with 'picture' field as image file, e.g.:
 <pre>
    req.headers:
     - Host: localhost:8000
     - Content-Type: multipart/form-data; [NOTE: large files may also have a boundary]
     - Accept-Encoding: gzip, deflate, br
     - etc.

    req.body:
     - picture: {...[IMAGE DATA], etc.}
 </pre>
 * @returns {Object}
 * status: 200, description: The file was uploaded & database updated.<br/>
 * status: 400, description: Request was malformed, e.g. lacking correct field, or target doesn't exist.<br/>
 * status: 500, description: Database or S3 Connection error.<br/>
 * <pre>
 {
    "message": "Image uploaded successfully!",
    "pictureUrl": "https://karma-kcl-staging.s3.eu-west-2.amazonaws.com/avatar-individual/hashedImageName.png"
 }
 </pre>
 *  @name Upload Profile Photo for Individuals and Organisations
 *  @function
 */
router.post("/upload/:userType", authService.requireAuthentication, (req, res) => {
    imgUpload.updateAvatar(req, res);
});

// == Profile Photo Deletion == //

/**
 * Endpoint called to delete profile pictures for an individual or organisation.<br/>
 * Deletes from database, and remote s3 host where appropriate.<br/>
 * URL example: POST http://localhost:8000/avatar/delete/individual
 *  <p><b>Route: </b>/avatar/delete/:userType (POST)</p>
 * <p><b>Permissions: </b>require user permissions</p>
 * @param {userId} user ID for the user, from auth
 * @param {userType} must be one of individual, organisation
 * @returns {Object}
 * status: 200, description: The file was deleted successful, or deleting image was not necessary.<br/>
 * status: 400, description: Request was malformed, e.g. lacking correct field, or target doesn't exist.<br/>
 * status: 500, description: Database or S3 Connection error.<br/>
 * <pre>
 {
    "message": "Successfully deleted image!",
    "oldLocation": "https://karma-kcl-staging.s3.eu-west-2.amazonaws.com/avatar-individual/hashedImageName.png"
 }
 </pre>
 *  @name Delete Profile Photo for Individuals and Organisations
 *  @function
 */
router.post("/delete/:userType", authService.requireAuthentication, (req, res) => {
    imgDelete.deleteAvatar(req, res);
});

// == Profile Photo Fetching == //

/**
 * Endpoint called to fetch default profile picture for current user type.<br/>
 * URL example: GET http://localhost:8000/avatar/default/organisation"
 * @param {userType} must be one of individual, organisation
 * @returns {Object}
 * status: 200, description: Success<br/>
 * status: 400, description: Invalid userType was given, or request was malformed.<br/>
 *  @name Fetch Current Profile Photo for Individuals and Organisations
 *  @function
 */
router.get("/default/:userType", imgFetch.getDefaultAvatar);

/**
 * Endpoint called to fetch profile pictures for an individual or organisation.<br/>
 * URL example: GET http://localhost:8000/avatar/individual/42
 *  <p><b>Route: </b>/avatar/:userType/:userId (GET)</p>
 * @param {userType} must be one of individual, organisation
 * @param {userId} user ID for the user
 * @returns {Object}
 * status: 200, description: The file was fetched successful, or default image was sent.<br/>
 * status: 400, description: Request was malformed, e.g. lacking correct field, or target doesn't exist.<br/>
 * status: 500, description: Database or S3 Connection error.<br/>
 * <pre>
 {
    "message": "Fetched image for user!",
    "pictureUrl": "http://localhost:8000/avatar/default/individual"
 }
 </pre>
 *  @name Fetch Profile Photo for Individuals and Organisations
 *  @function
 */
router.get("/:userType/:userId", imgFetch.getAvatar);

/**
 * Endpoint called to fetch profile picture for the currently authenticated individual or organisation.<br/>
 * URL example: GET http://localhost:8000/avatar/organisation
 *  <p><b>Route: </b>/avatar/:userType/:userId (POST)</p>
 * <p><b>Permissions: </b>require user permissions</p>
 * @param {userType} must be one of individual, organisation
 * @param {userId}   user ID for the user, from auth
 * @returns {Object}
 * status: 200, description: The file was fetched successful, or default image was sent.<br/>
 * status: 400, description: Request was malformed, e.g. lacking correct field, or target doesn't exist.<br/>
 * status: 500, description: Database or S3 Connection error.<br/>
 * <pre>
 {
    "message": "Fetched image for user!",
    "pictureUrl": "http://localhost:8000/avatar/default/organisation"
 }
 </pre>
 *  @name Fetch Current Profile Photo for Individuals and Organisations
 *  @function
 */
router.get("/:userType", authService.requireAuthentication, imgFetch.getAvatar); // == File Hosting (i.e. Default Images) ==

module.exports = router;
