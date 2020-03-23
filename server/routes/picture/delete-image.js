/* jshint esversion: 9 */

const aws = require('aws-sdk');

const individualRepository = require("../../models/databaseRepositories/individualRepository");
const organisationRepository = require("../../models/databaseRepositories/organisationRepository");
const imageRepository = require("../../models/databaseRepositories/pictureRepository");
const eventRepository = require("../../models/databaseRepositories/eventRepository");

aws.config.update({
    secretAccessKey: process.env.S3_SECRET_ACCESS,
    accessKeyId: process.env.S3_KEY_ID,
    region: process.env.S3_REGION,
});

const s3 = new aws.S3();
const userTypes = ['individual', 'organisation'];
const AWS_REGEX = /https?:\/\/.*\.amazonaws\.com\//;

/**
 * Remove avatar for a user (individual or organisation)
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 * @param {string} userType The type of User, i.e. one of: 'individual', 'organisation'
 */
const deleteAvatar = (req, res, userType) => {
    // delete from s3 only if no other findByUrl results
    if (!userType || !userTypes.includes(userType)) {
        res.json({
            message: `User type not specified, specify one of: ${userTypes.join(', ')}`,
        });
        return;
    }
    const userRepo = userType === 'individual' ? individualRepository : organisationRepository;
    userRepo.findById(req.query.userId).then(function(result) {
        if (result.rowCount < 1) {
            res.status(500);
            res.json({
                message: `There is no ${userType} with ID ${req.query.userId}`,
            });
        } else {
            const user = result.rows[0];

            if (!user.pictureId) {
                res.status(200);
                res.json({
                    message: `The ${userType} with user ID ${req.query.userId} has no image`,
                });
            } else {
                const pictureId = user.pictureId;
                user.pictureId = null;
                userRepo.update(user);

                imageRepository.findById(pictureId).then(function(pictureResult) {
                    if (!pictureResult.rows.length) {
                        res.status(200);
                        res.json({
                            message: `The image associated with with user ID ${req.query.userId} no longer exists`,
                        });
                    } else {
                        const picture = pictureResult.rows[0];
                        const pictureLocation = picture.pictureLocation;
                        const key = pictureLocation.replace(AWS_REGEX, "");
                        s3.deleteObject({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: key,
                        }, function(err, data) {
                            if (err) {
                                res.status(500);
                                res.json({
                                    message: err.message,
                                });
                            } else {
                                res.status(200);
                                res.json({
                                    message: `Successfully deleted image!`,
                                    old_location: pictureLocation,
                                });
                            }
                        });
                    }
                }).catch((error) => {
                    res.status(500);
                    res.json({
                        message: `${error}`,
                    });
                });
            }
        }
    });
};

/**
 * Remove picture for an event
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
const deleteEventPicture = (req, res) => {
    eventRepository.findById(req.params.eventId).then(function(result) {
        if (result.rowCount < 1) {
            res.json({
                message: `There is no event with ID ${req.params.eventId}`,
            });
        } else {
            const event = result.rows[0];
            if (event.userId.toString() !== req.query.userId) {
                res.status(300).send({
                    message: `You do not have permission to modify this event.`,
                });
            } else {
                if (!event.pictureId) {
                    res.status(200);
                    res.json({
                        message: `The event with ID ${req.params.eventId} has no image`,
                    });
                } else {
                    const pictureId = event.pictureId;
                    event.pictureId = null;
                    eventRepository.update(event);

                    imageRepository.findById(pictureId).then(function(pictureResult) {
                        if (!pictureResult.rows.length) {
                            res.status(200);
                            res.json({
                                message: `The image associated with with event ${req.params.eventId} no longer exists`,
                            });
                        } else {
                            const picture = pictureResult.rows[0];
                            const pictureLocation = picture.pictureLocation;
                            const key = pictureLocation.replace(AWS_REGEX, "");
                            s3.deleteObject({
                                Bucket: process.env.S3_BUCKET_NAME,
                                Key: key,
                            }, function(err, data) {
                                if (err) {
                                    res.status(500);
                                    res.json({
                                        message: err.message,
                                    });
                                } else {
                                    res.status(200);
                                    res.json({
                                        message: `Successfully deleted image!`,
                                        old_location: pictureLocation,
                                    });
                                }
                            });
                        }
                    }).catch((error) => {
                        res.status(500);
                        res.json({
                            message: `${error}`,
                        });
                    });
                }
            }
        }
    }).catch((error) => {
        res.status(500).send({message: error});
    });
};

module.exports = {
    deleteAvatar,
    deleteEventPicture,
};
