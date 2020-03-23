/* jshint esversion: 9 */

const aws = require('aws-sdk');
const multer = require('multer');
const crypto = require('crypto');
const s3Storage = require("multer-sharp-s3");

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

/**
 * Update image for a user (individual or organisation)
 * Re-sizes to max width 500 x 500 px and convert to png
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 * @param {string} userType The type of User, i.e. one of: 'individual', 'organisation'
 */
const updateAvatar = (req, res, userType) => {
    if (!userType || !userTypes.includes(userType)) {
        res.json({
            message: `User type not specified, specify one of: ${userTypes.join(', ')}`,
        });
        return;
    }
    const userRepo = userType === 'individual' ? individualRepository : organisationRepository;
    userRepo.findByUserID(req.query.userId).then(function(result) {
        if (result.rowCount < 1) {
            res.status(500);
            res.json({
                message: `There is no ${userType} with user ID ${req.query.userId}`,
            });
        } else {
            const avatarDir = `avatars-${userType}/`;
            const user = result.rows[0];

            const upload = multer({
                storage: s3Storage({
                    s3: s3,
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: function(req, file, cb) {
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
                        const updateUserImg = userType === 'individual' ?
                            imageRepository.updateIndividualAvatar :
                            imageRepository.updateOrganisationAvatar;
                        updateUserImg(user, picture).then((result) => {
                            res.status(200).send({
                                message: `Avatar successfully updated for ${userType} with ID ${req.query.userId}`,
                                location: `${req.file.Location}`,
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
};

/**
 * Update image for an event - user must be authed & event creator
 * Re-sizes to max width 800px and convert to png
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 */
const updateEventPicture = (req, res) => {
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
                const upload = multer({
                    storage: s3Storage({
                        s3: s3,
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: function(req, file, cb) {
                            const hash = crypto.createHash('md5')
                                .update(`karma_event_${req.params.eventId}`)
                                .digest('hex');
                            const filename = (hash + '.png');
                            cb(null, filename);
                        },
                        resize: {
                            width: 800,
                            // limit max resolution
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
                            imageRepository.updateEventPicture(event, picture).then((result) => {
                                res.status(200).send({
                                    message: `Image successfully updated for event with ID ${req.params.eventId}`,
                                    location: `${req.file.Location}`,
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
