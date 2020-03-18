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
const eventCauseRepository = require("../../models/databaseRepositories/eventCauseRepository");
const complaintRepository = require("../../models/databaseRepositories/complaintRepository");
const reportUserRepository = require("../../models/databaseRepositories/reportUserRepository");
const resetRepository = require("../../models/databaseRepositories/resetRepository");
const settingRepository = require("../../models/databaseRepositories/settingsRepository");
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
    await eventCauseRepository.removeByEventCreatorId(userId);
    await signUpRepository.removeByEventCreatorId(userId);
    await favouriteRepository.removeByEventCreatorId(userId);
    await eventRepository.removeByUserId(userId);
    await selectedCauseRepository.removeByUserId(userId);
    await complaintRepository.removeByUserId(userId);
    await resetRepository.removeByUserId(userId);
    await reportUserRepository.removeByUserId(userId);
    await settingRepository.removeByUserId(userId);

    const isIndividual = await util.isIndividual(userId);
    if (isIndividual) {
        const findIndividual = await individualRepository.findByUserID(userId);
        const individualId = findIndividual.rows[0].id;
        await pictureRepository.removeById(findIndividual.pictureId);
        await profileRepository.removeByIndividualId(individualId);
        await favouriteRepository.removeByIndividualId(individualId);
        await signUpRepository.removeByIndividualId(individualId);
        await individualRepository.removeByUserId(userId);
    }

    const isOrganisation = await util.isOrganisation(userId);
    if (isOrganisation) {
        const findOrganisation = await orgRepository.findByUserID(userId);
        await orgRepository.removeByUserId(userId);
        await pictureRepository.removeById(findOrganisation.pictureId);
    }


    const findUser = await userRepository.findById(userId);
    const addressId = findUser.addressId;
    const emailUser = findUser.email;
    await userRepository.removeUserById(userId);

    await registrationRepository.removeByEmail(emailUser);
    await addressRepository.removeById(addressId);

    return ({
        status: 200,
        message: "All User information deleted successfully",
        data: {user: findUser.rows[0]},
    });
};

module.exports = {
    deleteAllInformation,
};
