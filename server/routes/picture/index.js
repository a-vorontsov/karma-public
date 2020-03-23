/**
 * @module Avatars
 */

const express = require("express");
const router = express.Router();
const aws = require('aws-sdk');
const fs = require("fs");
const path = require('path');

const imgFetch = require("./fetch-image");
const imgUpload = require("./upload-image");
const imgDelete = require("./delete-image");

// directories where picture are found
const AVATAR_DIR = "./avatars/";
const NOT_FOUND_IMAGE = "_notFound.png";

aws.config.update({
    secretAccessKey: process.env.S3_SECRET_ACCESS,
    accessKeyId: process.env.S3_KEY_ID,
    region: process.env.S3_REGION,
});

router.get("/:pictureId", imgFetch.getPicture);

router.get("/event/:eventId", imgFetch.getEventPicture);

router.get("/default/404", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/" + NOT_FOUND_IMAGE));
});

module.exports = router;
