const log = require("../../../util/log");
const aws = require('aws-sdk');
const fs = require("fs");
const path = require("path");

const individualRepository = require("../../../repositories/individual");
const organisationRepository = require("../../../repositories/organisation");
const imageRepository = require("../../../repositories/picture");
const eventRepository = require("../../../repositories/event");

// directories where picture are found
const AVATAR_DIR = "./avatar/";
const INDIVIDUAL_AVATAR_DIR = AVATAR_DIR + "individual/";
const ORGANISATION_AVATAR_DIR = AVATAR_DIR + "organisation/";
const NOT_FOUND_IMAGE = "_notFound.png";

aws.config.update({
    secretAccessKey: process.env.S3_SECRET_ACCESS,
    accessKeyId: process.env.S3_KEY_ID,
    region: process.env.S3_REGION,
});

const userTypes = ['individual', 'organisation'];

/**
 * Fetch the profile picture for a user, fetching default if none is found.
 * @param {Request} req HTTP request object
 * inc. req.params.userType - The type of User, i.e. one of: 'individual', 'organisation'
 * @param {Response} res HTTP response object
 */
const getAvatar = (req, res) => {
    try {
        // allow for authed endpoint ID completion, and manually specified ID
        if (req.query.userId) {
            req.params.userId = req.query.userId;
        }
        const userType = req.params.userType;
        if (!userType || !userTypes.includes(userType)) {
            res.status(404).send({
                message: `User type not specified, specify one of: ${userTypes.join(', ')}`,
            });
        } else {
            const userRepo = userType === 'individual' ? individualRepository : organisationRepository;
            const imageGet = userType === 'individual' ?
                imageRepository.getIndividualAvatar :
                imageRepository.getOrganisationAvatar;
            userRepo.findByUserID(req.params.userId).then((result) => {
                if (result.rowCount < 1) {
                    res.status(404).send({
                        message: `There is no ${userType} with user ID ${req.params.userId}`,
                    });
                } else {
                    const user = result.rows[0];

                    imageGet(user).then((pictureResults) => {
                        const picture = pictureResults.rows[0];
                        const defaultDirectory = userType === 'individual' ?
                            INDIVIDUAL_AVATAR_DIR :
                            ORGANISATION_AVATAR_DIR;

                        if (!picture || !picture.pictureLocation) {
                            const defaultPic = path.join(__dirname, defaultDirectory + "_default.png");

                            // check existence of default profile picture icons - send correct placeholder
                            fs.access(defaultPic, error => {
                                if (!error) {
                                    res.status(200).send({
                                        message: "Fetched image for user!",
                                        picture_url: (req.connection.encrypted ? "https://" : "http://") +
                                            req.headers.host + `/avatar/default/${userType}`,
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
                            log.info(`Fetched picture URL for ${userType} with user ID ` +
                                `${req.params.userId}, at ${picture.pictureLocation}`);
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
        }
    } catch (e) {
        res.status(400).send({
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
                        log.info(`Fetched picture URL for event with ID ` +
                            `${req.params.eventId}, at ${picture.pictureLocation}`);
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
                    log.info(`Fetched picture URL for picture with ID ` +
                        `${req.params.pictureId}, at ${picture.pictureLocation}`);
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

/**
 * Fetch the default picture for a given user type
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
const getDefaultAvatar = (req, res) => {
    const defaultFile = "_default.png";
    const userType = req.params.userType;
    if (!userType || !userTypes.includes(userType)) {
        res.status(400).send({
            message: `User type not specified, specify one of: ${userTypes.join(', ')}`,
        });
    } else {
        const defaultFilePath = path.join(__dirname,
            (userType === "individual" ?
                INDIVIDUAL_AVATAR_DIR : ORGANISATION_AVATAR_DIR) +
            defaultFile);
        res.sendFile(path.resolve(defaultFilePath));
    }
};

/**
 * Fetch the default picture for file-not-found
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
const get404Image = (req, res) => {
    res.sendFile(path.resolve(__dirname + "/" + NOT_FOUND_IMAGE));
};

module.exports = {
    getAvatar,
    getEventPicture,
    getPicture,
    getDefaultAvatar,
    get404Image,
};
