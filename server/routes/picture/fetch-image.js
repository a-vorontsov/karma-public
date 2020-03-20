/* jshint esversion: 9 */

const aws = require('aws-sdk');
const fs = require("fs");
const path = require("path");

const individualRepository = require("../../models/databaseRepositories/individualRepository");
const organisationRepository = require("../../models/databaseRepositories/organisationRepository");
const imageRepository = require("../../models/databaseRepositories/pictureRepository");

// directories where picture are found
const AVATAR_DIR = "./avatars/";
const INDIVIDUAL_AVATAR_DIR = AVATAR_DIR + "individual/";
const ORGANISATION_AVATAR_DIR = AVATAR_DIR + "organisation/";

aws.config.update({
    secretAccessKey: process.env.S3_SECRET_ACCESS,
    accessKeyId: process.env.S3_KEY_ID,
    region: process.env.S3_REGION,
});

/**
 * Fetch the profile picture for an individual user, fetching default if none is found.
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
function getIndividualAvatar(req, res) {
    try {
        individualRepository.findById(req.params.id).then((userResult) => {
            const user = userResult.rows[0];
            imageRepository.getIndividualAvatar(user).then((pictureResults) => {
                const picture = pictureResults.rows[0];

                if (!picture || !picture.pictureLocation) {
                    const defaultPic = path.join(__dirname, INDIVIDUAL_AVATAR_DIR + "_default.png");

                    // check existence of profile picture and send response
                    fs.access(defaultPic, error => {
                        if (!error) {
                            res.status(200).send({
                                message: "Fetched image for user!",
                                picture_url: (req.connection.encrypted ? "https://" : "http://") +
                                    req.headers.host + "/avatars/default/individual",
                            });
                        } else {
                            // no profile picture is associated with given user
                            res.status(500).send({
                                message: `Cannot find default image at ${defaultPic}`,
                            });
                        }
                    });
                } else {
                    // return s3 image url
                    res.status(200).send({
                        message: "Fetched image for user!",
                        picture_url: picture.pictureLocation,
                    });
                }
            }).catch((e) => {
                res.status(400).send({
                    message: e.message,
                });
            });
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
        });
    }
}

/**
 * Fetch the profile picture for an organisation user, fetching default if none is found.
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
function getCompanyAvatar(req, res) {
    try {
        organisationRepository.findById(req.params.id).then((userResult) => {
            const user = userResult.rows[0];
            imageRepository.getOrganisationAvatar(user).then((pictureResults) => {
                const picture = pictureResults.rows[0];

                if (!picture || !picture.pictureLocation) {
                    const defaultPic = path.join(__dirname, ORGANISATION_AVATAR_DIR + "_default.png");

                    // check existence of profile picture and send response
                    fs.access(defaultPic, error => {
                        if (!error) {
                            res.status(200).send({
                                message: "Fetched image for user!",
                                picture_url: (req.connection.encrypted ? "https://" : "http://") +
                                    req.headers.host + "/avatars/default/organisation",
                            });
                        } else {
                            // no profile picture is associated with given user
                            res.status(500).send({
                                message: `Cannot find default image at ${defaultPic}`,
                            });
                        }
                    });
                } else {
                    // return s3 image url
                    res.status(200).send({
                        message: "Fetched image for user!",
                        picture_url: picture.pictureLocation,
                    });
                }
            }).catch((e) => {
                res.status(400).send({
                    message: e.message,
                });
            });
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
        });
    }
}

module.exports = {
    getIndividualAvatar,
    getCompanyAvatar,
};
