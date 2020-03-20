/* jshint esversion: 9 */

const express = require("express");
const router = express.Router();
const path = require('path');

const imgFetch = require("../picture/fetch-image");
const imgUpload = require("../picture/upload-image");

/**
 * Handling for fetching, uploading and deleting pictures, e.g. event and profile photos (avatars)
 * */

/**
 * Endpoint called to upload & update profile pictures for an individual.
 * URL example: POST http://localhost:8000/avatars/upload/individual/5
 * The image will be resized to 500x500 automatically, and the URL added to the `picture` table.
 * Valid file types: jpg, jpeg, png
 * @param {Event} req multipart form-data with 'avatar' field as image file, e.g.:
 *  req.headers:
 *  - Host: localhost:8000
 *  - Content-Type: multipart/form-data; [NOTE: large files may also have a boundary]
 *  - Accept-Encoding: gzip, deflate, br
 *  - etc.
 *  req.body:
 *  - avatar: {...[IMAGE DATA], etc.}
 * @returns:
 * status: 200, description: The file was uploaded & database updated.
 * status: 400, description: Request was malformed, e.g. lacking correct field.
 * status: 500, description: Database or S3 Connection error
 */
router.post("/upload/individual/:id", (req, res) => {
    imgUpload.updateAvatar(req, res, 'individual');
});

/**
 * Endpoint called to upload & update profile pictures for an organisation.
 * URL example: POST http://localhost:8000/avatars/upload/organisation/5
 * The image will be resized to 500x500 automatically, and the URL added to the `picture` table.
 * Valid file types: jpg, jpeg, png
 * @param {Event} req multipart form-data with 'avatar' field as image file, e.g.:
 *  req.headers:
 *  - Host: localhost:8000
 *  - Content-Type: multipart/form-data; [NOTE: large files may also have a boundary]
 *  - Accept-Encoding: gzip, deflate, br
 *  - etc.
 *  req.body:
 *  - avatar: {...[IMAGE DATA], etc.}
 * @returns:
 * status: 200, description: The file was uploaded & database updated.
 * status: 400, description: Request was malformed, e.g. lacking correct field.
 * status: 500, description: Database or S3 Connection error
 */
router.post("/upload/organisation/:id", (req, res) => {
    imgUpload.updateAvatar(req, res, 'organisation');
});

router.get("/default/individual", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../picture/avatars/individual/_default.png"));
});

router.get("/default/organisation", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../picture/avatars/organisation/_default.png"));
});

// Fetching profile avatar endpoints
router.get("/individual/:id", imgFetch.getIndividualAvatar);
router.get("/organisation/:id", imgFetch.getCompanyAvatar);

module.exports = router;
