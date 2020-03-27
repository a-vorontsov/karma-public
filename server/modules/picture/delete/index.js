const log = require("../../../util/log");
const aws = require('aws-sdk');

const individualRepository = require("../../../repositories/individual");
const organisationRepository = require("../../../repositories/organisation");
const imageRepository = require("../../../repositories/picture");
const eventRepository = require("../../../repositories/event");

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
 * inc. req.params.userType - The type of User, i.e. one of: 'individual', 'organisation'
 * @param {Response} res HTTP response object
 */
const deleteAvatar = (req, res) => {
    const userType = req.params.userType;
    if (!userType || !userTypes.includes(userType)) {
        res.status(400).send({
            message: `User type not specified, specify one of: ${userTypes.join(', ')}`,
        });
        return;
    }
    const userRepo = userType === 'individual' ? individualRepository : organisationRepository;
    userRepo.findByUserID(req.query.userId).then((result) => {
        if (result.rowCount < 1) {
            res.status(404).send({
                message: `There is no ${userType} with ID ${req.query.userId}`,
            });
        } else {
            const user = result.rows[0];

            if (!user.pictureId) {
                res.status(200).send({
                    message: `The ${userType} with user ID ${req.query.userId} has no image`,
                });
            } else {
                const pictureId = user.pictureId;
                user.pictureId = null;
                userRepo.update(user);

                imageRepository.findById(pictureId).then((pictureResult) => {
                    if (!pictureResult.rows.length) {
                        res.status(200).send({
                            message: `The image associated with with user ID ${req.query.userId} no longer exists`,
                        });
                    } else {
                        const picture = pictureResult.rows[0];
                        const pictureLocation = picture.pictureLocation;
                        const key = pictureLocation.replace(AWS_REGEX, "");
                        s3.deleteObject({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: key,
                        }, (err, data) => {
                            if (err) {
                                log.error(`Failed to delete picture for ${userType} with user ID ${req.query.userId}.` +
                                    ` Error code ${err.code}: ${err.message}`);
                                res.status(500).send({
                                    message: err.message,
                                });
                            } else {
                                log.info(`Deleted picture for ${userType} with user ID ${req.query.userId}`);
                                res.status(200).send({
                                    message: `Successfully deleted image!`,
                                    oldLocation: pictureLocation,
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
    eventRepository.findById(req.params.eventId).then((result) => {
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

                    imageRepository.findById(pictureId).then((pictureResult) => {
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
                            }, (err, data) => {
                                if (err) {
                                    log.error(`Failed to delete picture for event with ID ${req.params.eventId}. ` +
                                        `Error code ${err.code}: ${err.message}`);
                                    res.status(500).send({
                                        message: err.message,
                                    });
                                } else {
                                    log.info(`Deleted picture for event with ID ${req.params.eventId}`);
                                    res.status(200).send({
                                        message: `Successfully deleted image!`,
                                        oldLocation: pictureLocation,
                                    });
                                }
                            });
                        }
                    }).catch((error) => {
                        res.status(500).send({
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
