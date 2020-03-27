const log = require("../../../util/log");
const aws = require('aws-sdk');
const multer = require('multer');
const crypto = require('crypto');
const s3Storage = require("multer-sharp-s3");

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

/**
 * Update image for a user (individual or organisation)
 * Re-sizes to max width 500 x 500 px and convert to png
 * @param {Request} req HTTP request object
 * inc. req.params.userType - The type of User, i.e. one of: 'individual', 'organisation'
 * @param {Response} res HTTP response object
 */
const updateAvatar = (req, res) => {
    const userType = req.params.userType;
    if (!userType || !userTypes.includes(userType)) {
        res.status(404).send({
            message: `User type not specified, specify one of: ${userTypes.join(', ')}`,
        });
    } else {
        const userRepo = userType === 'individual' ? individualRepository : organisationRepository;
        userRepo.findByUserID(req.query.userId).then((result) => {
            if (result.rowCount < 1) {
                res.status(404).send({
                    message: `There is no ${userType} with user ID ${req.query.userId}`,
                });
            } else {
                const avatarDir = `avatar-${userType}/`;
                const user = result.rows[0];

                const upload = multer({
                    storage: s3Storage({
                        s3: s3,
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: (req, file, cb) => {
                            const hash = crypto.createHash('md5')
                                .update(`karma_${userType}_${req.query.userId}`)
                                .digest('hex');
                            const filename = (avatarDir + hash + '.png');
                            cb(null, filename);
                        },
                        resize: {
                            width: 500,
                            height: 500,
                        },
                        toFormat: {
                            type: 'png',
                        },
                    }),
                }).single('picture');

                upload(req, res, error => {
                    if (!req.file) {
                        log.error(`Failed avatar updated for ${userType} ` +
                            `with user ID ${req.query.userId}: no file was given`);
                        res.status(400).send({
                            message: `No file was given`,
                        });
                    } else if (!/^image\/((jpe?g)|(png))$/.test(req.file.mimetype)) {
                        log.error(`Failed avatar updated for ${userType} ` +
                            `with user ID ${req.query.userId}: invalid filetype give (${req.file.mimetype})`);
                        res.status(400).send({
                            message: `File type must be .png or .jpg'`,
                        });
                    } else if (error) {
                        res.status(500).send({error: error});
                    } else {
                        imageRepository.insert({
                            pictureLocation: req.file.Location,
                        }).then((pictureResult) => {
                            const picture = pictureResult.rows[0];
                            const updateUserImg = userType === 'individual' ?
                                imageRepository.updateIndividualAvatar :
                                imageRepository.updateOrganisationAvatar;
                            updateUserImg(user, picture).then((result) => {
                                log.info(`Updated avatar for ${userType} ` +
                                 `with user ID ${req.query.userId} to ${req.file.location}`);

                                res.status(200).send({
                                    message: `Avatar successfully updated for ${userType} with ID ${req.query.userId}`,
                                    pictureUrl: `${req.file.Location}`,
                                });
                            }).catch((error) => {
                                res.status(500).send({message: error});
                            });
                        }).catch((error) => {
                            res.status(500).send({message: error});
                        });
                    }
                });
            }
        });
    }
};

/**
 * Update image for an event - user must be authed & event creator
 * Re-sizes to max width 800px and convert to png
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
const updateEventPicture = (req, res) => {
    eventRepository.findById(req.params.eventId).then((result) => {
        if (result.rowCount < 1) {
            res.status(404).send({
                message: `There is no event with ID ${req.params.eventId}`,
            });
        } else {
            const event = result.rows[0];
            if (event.userId.toString() !== req.query.userId) {
                res.status(300).send({
                    message: `You do not have permission to modify this event.`,
                });
            } else {
                const upload = multer({
                    storage: s3Storage({
                        s3: s3,
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: (req, file, cb) => {
                            const hash = crypto.createHash('md5')
                                .update(`karma_event_${req.params.eventId}`)
                                .digest('hex');
                            const filename = (hash + '.png');
                            cb(null, filename);
                        },
                        resize: {
                            width: 800, // limit max resolution
                        },
                        toFormat: {
                            type: 'png',
                        },
                    }),
                }).single('picture');

                upload(req, res, error => {
                    if (!req.file) {
                        res.status(400).send({
                            message: `No file was given`,
                        });
                    } else if (!/^image\/((jpe?g)|(png))$/.test(req.file.mimetype)) {
                        res.status(400).send({
                            message: `File type must be .png or .jpg'`,
                        });
                    } else if (error) {
                        res.status(500).send({error: error});
                    } else {
                        imageRepository.insert({
                            pictureLocation: req.file.Location,
                        }).then((pictureResult) => {
                            const picture = pictureResult.rows[0];
                            imageRepository.updateEventPicture(event, picture).then(() => {
                                log.info(`Updated picture for event ` +
                                    `with ID ${req.params.eventId} to ${req.file.location}`);
                                res.status(200).send({
                                    message: `Image successfully updated for event with ID ${req.params.eventId}`,
                                    pictureUrl: `${req.file.Location}`,
                                });
                            }).catch((error) => {
                                res.status(500).send({message: error});
                            });
                        }).catch((error) => {
                            res.status(500).send({message: error});
                        });
                    }
                });
            }
        }
    }).catch((error) => {
        res.status(500).send({message: error});
    });
};

module.exports = {
    updateAvatar,
    updateEventPicture,
};
