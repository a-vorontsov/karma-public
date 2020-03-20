const testHelpers = require("../../test/testHelpers");
const deletionService = require("./index");

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

jest.mock("../../models/databaseRepositories/addressRepository");
jest.mock("../../models/databaseRepositories/favouriteRepository");
jest.mock("../../models/databaseRepositories/userRepository");
jest.mock("../../models/databaseRepositories/selectedCauseRepository");
jest.mock("../../models/databaseRepositories/signupRepository");
jest.mock("../../models/databaseRepositories/registrationRepository");
jest.mock("../../models/databaseRepositories/individualRepository");
jest.mock("../../models/databaseRepositories/profileRepository");
jest.mock("../../models/databaseRepositories/notificationRepository");
jest.mock("../../models/databaseRepositories/eventRepository");
jest.mock("../../models/databaseRepositories/organisationRepository");
jest.mock("../../models/databaseRepositories/pictureRepository");
jest.mock("../../models/databaseRepositories/eventCauseRepository");
jest.mock("../../models/databaseRepositories/complaintRepository");
jest.mock("../../models/databaseRepositories/reportUserRepository");
jest.mock("../../models/databaseRepositories/resetRepository");
jest.mock("../../models/databaseRepositories/settingsRepository");
jest.mock("../../util/util");

let user, individual, organisation;

beforeEach(() => {
    user = testHelpers.getUserExample1();
    individual = testHelpers.getIndividual();
    organisation = testHelpers.getOrganisation();
    jest.clearAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("deleting user who is individual works", async () => {
    util.checkUserId.mockResolvedValue({status: 200});
    util.isIndividual.mockResolvedValue(true);
    util.isOrganisation.mockResolvedValue(false);

    individualRepository.findByUserID.mockResolvedValue({
        rows: [{
            ...individual,
            id: 1,
        }],
    });

    userRepository.removeUserById.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });

    const deleteAllInformation = await deletionService.deleteAllInformation(1);

    expect(notificationRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(eventCauseRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(signUpRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(favouriteRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(eventRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(selectedCauseRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(complaintRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(resetRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(reportUserRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(settingRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(pictureRepository.removeById).toHaveBeenCalledTimes(1);
    expect(profileRepository.removeByIndividualId).toHaveBeenCalledTimes(1);
    expect(favouriteRepository.removeByIndividualId).toHaveBeenCalledTimes(1);
    expect(signUpRepository.removeByIndividualId).toHaveBeenCalledTimes(1);
    expect(individualRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(userRepository.removeUserById).toHaveBeenCalledTimes(1);
    expect(registrationRepository.removeByEmail).toHaveBeenCalledTimes(1);
    expect(addressRepository.removeById).toHaveBeenCalledTimes(1);
    expect(individualRepository.findByUserID).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledTimes(0);
    expect(orgRepository.removeByUserId).toHaveBeenCalledTimes(0);
    expect(deleteAllInformation.data.user).toMatchObject({
        ...user,
        id: 1,
    });
    expect(deleteAllInformation.status).toBe(200);
});

test("deleting user who is org works", async () => {
    util.checkUserId.mockResolvedValue({status: 200});
    util.isIndividual.mockResolvedValue(false);
    util.isOrganisation.mockResolvedValue(true);

    orgRepository.removeByUserId.mockResolvedValue({
        rows: [{
            ...organisation,
            id: 1,
        }],
    });

    userRepository.removeUserById.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });

    const deleteAllInformation = await deletionService.deleteAllInformation(1);

    expect(notificationRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(eventCauseRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(signUpRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(favouriteRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(eventRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(selectedCauseRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(complaintRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(resetRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(reportUserRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(settingRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(orgRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(pictureRepository.removeById).toHaveBeenCalledTimes(1);
    expect(userRepository.removeUserById).toHaveBeenCalledTimes(1);
    expect(registrationRepository.removeByEmail).toHaveBeenCalledTimes(1);
    expect(addressRepository.removeById).toHaveBeenCalledTimes(1);
    expect(individualRepository.findByUserID).toHaveBeenCalledTimes(0);
    expect(orgRepository.findByUserID).toHaveBeenCalledTimes(0);
    expect(userRepository.findById).toHaveBeenCalledTimes(0);
    expect(orgRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(profileRepository.removeByIndividualId).toHaveBeenCalledTimes(0);
    expect(deleteAllInformation.data.user).toMatchObject({
        ...user,
        id: 1,
    });
    expect(deleteAllInformation.status).toBe(200);
});
