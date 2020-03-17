const addressRepository = require("../../models/databaseRepositories/addressRepository");
const favouriteRepository = require("../../models/databaseRepositories/favouriteRepository");
const userRepository = require("../../models/databaseRepositories/userRepository");
const selectedCauseRepository = require("../../models/databaseRepositories/selectedCauseRepository");
const signUpRepository = require("../../models/databaseRepositories/signupRepository");
const registrationRepository = require("../../models/databaseRepositories/registrationRepository");
const individualRepository = require("../../models/databaseRepositories/individualRepository");
const profileRepository = require("../../models/databaseRepositories/profileRepository");
const notificationRepository = require("../../models/databaseRepositories/notificationRepository");
const eventRepository = require("../../models/databaseRepositories/eventRepository");
const orgRepository = require("../../models/databaseRepositories/organisationRepository");
const pictureRepository = require("../../models/databaseRepositories/pictureRepository");
const util = require("../../util/util");

/**
 * Deletes all information about a user.
 * @param {Number} userId of user to delete,
 * Fails if userId is invalid.
 */
const deleteAllInformation = async (userId) => {
    const userIdCheckResponse = await util.checkUserId(userId);
    if (userIdCheckResponse.status !== 200) {
        return userIdCheckResponse;
    }

    await notificationRepository.removeByUserId(userId);
    await eventRepository.removeByUserId(userId);
    await selectedCauseRepository.removeByUserId(userId);

    const isIndividual = await util.isIndividual(userId);
    if (isIndividual) {
        const findIndividual = await individualRepository.findByUserID(userId);
        await individualRepository.removeByUserId(userId);
        const individualId = findIndividual.id;
        await pictureRepository.removeById(findIndividual.pictureId);

        await profileRepository.removeByIndividualId(individualId);
        await favouriteRepository.removeByIndividualId(individualId);
        await signUpRepository.removeByIndividualId(individualId);

    }

    const isOrganisation = await util.isOrganisation(userId);
    if (isOrganisation) {
        const findOrganisation = await orgRepository.findByUserID(userId);
        await orgRepository.removeByUserId(userId);
        await pictureRepository.removeById(findOrganisation.pictureId);
    }

    const deleteUser = await userRepository.removeUserById(userId);
    const addressId = deleteUser.addressId;
    const emailUser = deleteUser.email;

    await registrationRepository.removeByEmail(emailUser);
    await addressRepository.removeById(addressId);

    return ({
        status: 200,
        message: "All User information deleted successfully",
        data: {event: deleteUser.rows[0]},
    });
};

module.exports = {
    deleteAllInformation,
};
