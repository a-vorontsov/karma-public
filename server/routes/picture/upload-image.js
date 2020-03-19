/* jshint esversion: 9 */

const aws = require('aws-sdk');
const multer = require('multer');
const crypto = require('crypto');
const s3Storage = require("multer-sharp-s3");

const individualRepository = require("../../models/databaseRepositories/individualRepository");
const organisationRepository = require("../../models/databaseRepositories/organisationRepository");
const imageRepository = require("../../models/databaseRepositories/pictureRepository");

aws.config.update({
    secretAccessKey: process.env.S3_SECRET_ACCESS,
    accessKeyId: process.env.S3_KEY_ID,
    region: process.env.S3_REGION,
});

const s3 = new aws.S3();

/**
 * Update avatar for a user (individual or organisation)
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 * @param {string} userType The type of User, i.e. one of: individual, organisation
 */
function updateAvatar(req, res, userType) {
    const userTypes = ['individual', 'organisation'];
    if (!userType || !userTypes.includes(userType)) {
        res.json({
            message: `User type not specified, specify one of: ${userTypes.join(', ')}`,
        });
        return;
    }
    const userRepo = userType === 'individual' ? individualRepository : organisationRepository;
    userRepo.findById(req.params.id).then(function(result) {
        if (result.rowCount < 1) {
            res.status(500);
            res.json({
                message: `There is no ${userType} with ID ${req.params.id}`,
            });
        } else {
            const avatarDir = `avatars-${userType}/`;
            const user = result.rows[0];

            const upload = multer({
                storage: s3Storage({
                    s3: s3,
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: function (req, file, cb) {
                        const hash = crypto.createHash('md5')
                            .update(`karma_${userType}_${req.params.id}`)
                            .digest('hex');
                        const filename = (avatarDir + hash + '.png');
                        cb(null, filename);
                    },
                    resize: {
                        width: 500,
                        height: 500,
                    },
                }),
            }).single('avatar');

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
                                message: `Avatar successfully updated for ${userType} with ID ${req.params.id}`,
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
}

module.exports = {
    updateAvatar: updateAvatar,
};