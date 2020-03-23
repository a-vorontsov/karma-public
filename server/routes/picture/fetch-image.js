/* jshint esversion: 9 */

const aws = require('aws-sdk');
const fs = require("fs");
const path = require("path");

const individualRepository = require("../../models/databaseRepositories/individualRepository");
const organisationRepository = require("../../models/databaseRepositories/organisationRepository");
const imageRepository = require("../../models/databaseRepositories/pictureRepository");
const eventRepository = require("../../models/databaseRepositories/eventRepository");

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
const getIndividualAvatar = (req, res) => {
    try {
        // allow for authed endpoint ID completion, and manually specified ID
        if (req.query.userId) {
            req.params.userId = req.query.userId;
        }
        individualRepository.findByUserID(req.params.userId).then((userResult) => {
            if (!userResult.rows.length) {
                res.status(400).send({
                    message: `Could not find individual with user ID of ${req.params.userId}`,
                });
            } else {
                const user = userResult.rows[0];
                imageRepository.getIndividualAvatar(user).then((pictureResults) => {
                    const picture = pictureResults.rows[0];

                    if (!picture || !picture.pictureLocation) {
                        const defaultPic = path.join(__dirname, INDIVIDUAL_AVATAR_DIR + "_default.png");

                        // check existence of default profile picture icons - send correct placeholder
                        fs.access(defaultPic, error => {
                            if (!error) {
                                res.status(200).send({
                                    message: "No image for user, sending default",
                                    picture_url: (req.connection.encrypted ? "https://" : "http://") +
                                        req.headers.host + "/avatars/default/organisation",
                                });
                            } else {
                                res.status(200).send({
                                    message: "Image not found",
                                    picture_url: (req.connection.encrypted ? "https://" : "http://") +
                                        req.headers.host + "/picture/default/404",
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
            }
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
        });
    }
};

/**
 * Fetch the profile picture for an organisation user, fetching default if none is found.
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
const getCompanyAvatar = (req, res) => {
    try {
        // allow for authed endpoint ID completion, and manually specified ID
        if (req.query.userId) {
            req.params.userId = req.query.userId;
        }
        organisationRepository.findByUserID(req.params.userId).then((userResult) => {
            if (!userResult.rows.length) {
                res.status(400).send({
                    message: `Could not find organisation with user ID of ${req.params.userId}`,
                });
            } else {
                const user = userResult.rows[0];
                imageRepository.getOrganisationAvatar(user).then((pictureResults) => {
                    const picture = pictureResults.rows[0];

                    if (!picture || !picture.pictureLocation) {
                        const defaultPic = path.join(__dirname, ORGANISATION_AVATAR_DIR + "_default.png");

                        // check existence of default profile picture icons - send correct placeholder
                        fs.access(defaultPic, error => {
                            if (!error) {
                                res.status(200).send({
                                    message: "Fetched image for user!",
                                    picture_url: (req.connection.encrypted ? "https://" : "http://") +
                                        req.headers.host + "/avatars/default/organisation",
                                });
                            } else {
                                // no profile picture is associated with given user
                                res.status(200).send({
                                    message: "Fetched image for user!",
                                    picture_url: (req.connection.encrypted ? "https://" : "http://") +
                                        req.headers.host + "/picture/default/404",
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
            }
        });
    } catch (e) {
        res.status(500).send({
            message: e.message,
        });
    }
};

/**
 * Fetch the picture for a given event, fetching default (with 404) if none is found.
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
const getEventPicture = (req, res) => {
    try {
        eventRepository.findById(req.params.eventId).then((eventResult) => {
            if (!eventResult.rows.length) {
                res.status(400).send({
                    message: `Could not find event with ID of ${req.params.eventId}`,
                });
            } else {
                const event = eventResult.rows[0];
                imageRepository.getEventPicture(event).then((pictureResults) => {
                    const picture = pictureResults.rows[0];
                    if (!picture || !picture.pictureLocation) {
                        // no picture is associated with given event
                        res.status(200).send({
                            message: "No image associated with this event",
                            picture_url: (req.connection.encrypted ? "https://" : "http://") +
                                req.headers.host + "/picture/default/404",
                        });
                    } else {
                        // return s3 image url
                        res.status(200).send({
                            message: "Fetched image for event!",
                            picture_url: picture.pictureLocation,
                        });
                    }
                }).catch((e) => {
                    res.status(400).send({
                        message: e.message,
                    });
                });
            }
        });
    } catch (e) {
        res.status(500).send({
            message: e.message,
        });
    }
};

/**
 * Fetch the picture location for a given picture by ID, fetching default (with 404) if none is found.
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
const getPicture = (req, res) => {
    try {
        imageRepository.findById(req.params.pictureId).then((pictureResult) => {
            if (!pictureResult.rows.length) {
                res.status(400).send({
                    message: `Could not find picture with ID of ${req.params.pictureId}`,
                    picture_url: (req.connection.encrypted ? "https://" : "http://") +
                        req.headers.host + "/picture/default/404",
                });
            } else {
                const picture = pictureResult.rows[0];
                if (!picture || !picture.pictureLocation) {
                    // check existence of default profile picture icons - send correct placeholder
                    res.status(400).send({
                        message: "No picture location was given",
                        picture_url: (req.connection.encrypted ? "https://" : "http://") +
                            req.headers.host + "/picture/default/404",
                    });
                } else {
                    // return s3 image url
                    res.status(200).send({
                        message: `Fetched image with ${req.params.pictureId}`,
                        picture_url: picture.pictureLocation,
                    });
                }
            }
        }).catch((e) => {
            res.status(400).send({
                message: e.message,
            });
        });
    } catch (e) {
        res.status(500).send({
            message: e.message,
        });
    }
};

module.exports = {
    getIndividualAvatar,
    getCompanyAvatar,
    getEventPicture,
    getPicture,
};
