const digest = require("./digest");
const regStatus = require("./registration-status");
const regRepo = require("../../models/databaseRepositories/registrationRepository");
const userRepo = require("../../models/databaseRepositories/userRepository");
const individualRepo = require("../../models/databaseRepositories/individualRepository");
const orgRepo = require("../../models/databaseRepositories/organisationRepository");
const addressRepo = require("../../models/databaseRepositories/addressRepository");
const profileRepo = require("../../models/databaseRepositories/profileRepository");
const date = require("date-and-time");
const tokenSender = require("../verification/tokenSender");
const authAgent = require("./auth-agent");

/**
 * Register a new record in the registration table.
 * @param {string} email
 * @throws {error} if email already stored
 * @throws {error} if invalid query
 */
async function registerEmail(email) {
    if (await regStatus.emailExists(email)) {
        throw new Error("Invalid operation: email already exists.");
    }
    await tokenSender.storeAndSendEmailVerificationToken(email);
}

/**
 * Register a new user with given email, username
 * and password, then return the new user's id.
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @return {number} id of new user
 * @throws {error} if registration record not found
 * @throws {error} if already registered
 * @throws {error} if invalid query
 */
async function registerUser(email, username, password) {
    if (!(await regStatus.emailExists(email))) {
        throw new Error("Invalid operation: registration record not found.");
    }
    if (await regStatus.isPartlyRegistered(email) || await regStatus.isFullyRegisteredByEmail(email)) {
        throw new Error("Invalid operation: user record already exists.");
    }
    if (await regStatus.userAccountExists(email)) {
        throw new Error("500:Internal Server Error." +
            "This may be an indicator of malfunctioning DB queries, logical programming errors, or corrupt data.");
    }

    const secureSalt = digest.generateSecureSaltInHex();
    const hashedPassword = digest.hashPassWithSaltInHex(
        password,
        secureSalt,
    );

    await userRepo.insert({
        email: email,
        username: username,
        passwordHash: hashedPassword,
        verified: false,
        salt: secureSalt,
        dateRegistered: date.format(new Date(), "YYYY-MM-DD HH:mm:ss", true),
    });
    const userResult = await userRepo.findByEmail(email);
    const userId = userResult.rows[0].id;
    const authToken = await authAgent.logIn(userId);
    return ({
        status: 200,
        message: "User registration successful. Go to individual/org registration selection",
        userId: userId,
        authToken: authToken,
    });
}

/**
 * Register a new individual.
 * @param {number} userId
 * @param {object} individual
 * @throws {error} if already registered
 * @throws {error} if invalid query
 */
async function registerIndividual(userId, individual) {
    if (await regStatus.isFullyRegisteredById(userId)) {
        throw new Error("Invalid operation: already fully registered.");
    }

    const addressId = await registerAddress(individual.address);

    const individualResult = await individualRepo.insert({
        firstname: individual.firstName,
        lastname: individual.lastName,
        phone: individual.phoneNumber,
        banned: false,
        userId: userId,
        pictureId: null, // TODO:
        addressId: addressId,
        birthday: individual.dateOfBirth,
        gender: individual.gender,
        // TODO: title
    });

    await createEmptyProfile(individualResult.rows[0].id);
    await setSignUpFlagTrue(userId);
}

/**
 * Set sign-up flag for given user to be 1,
 * true, reflecting that they are fully registered.
 * A full registration means having a user account
 * and either an individual or an organisation account
 * recorded in the database.
 * @param {number} userId
 */
async function setSignUpFlagTrue(userId) {
    const userResult = await userRepo.findById(userId);
    const userRecord = userResult.rows[0];
    await regRepo.updateSignUpFlag(userRecord.email);
}

/**
 * Register a new organisation
 * @param {number} userId
 * @param {object} organisation
 */
async function registerOrg(userId, organisation) {
    if (await regStatus.isFullyRegisteredById(userId)) {
        throw new Error("Invalid operation: already fully registered.");
    }

    const addressId = await registerAddress(organisation.address);

    await orgRepo.insert({
        orgName: organisation.name,
        orgNumber: organisation.organisationNumber,
        orgType: organisation.organisationType,
        pocFirstname: organisation.pocFirstName,
        pocLastname: organisation.pocLastName,
        phone: organisation.phoneNumber,
        banned: false,
        orgRegisterDate: date.format(new Date(), "YYYY-MM-DD HH:mm:ss", true),
        lowIncome: organisation.lowIncome,
        exempt: organisation.exempt,
        pictureId: null, // TODO:
        userId: userId,
        addressId: addressId,
    });

    await setSignUpFlagTrue(userId);
}

/**
 * Register address and return it's id.
 * @param {object} address
 * @return {number} addressId
 */
async function registerAddress(address) {
    return (await addressRepo.insert({
        address1: address.addressLine1,
        address2: address.addressLine2,
        postcode: address.postCode,
        city: address.townCity,
        region: address.countryState,
        lat: 0, // TODO: compute here?
        long: 0,
    })).rows[0].id;
}

/**
 * Create empty profile with individualId and return profile.
 * @param {Number} individualId
 * @return {object} profile
 */
async function createEmptyProfile(individualId) {
    const insertProfile = {
        individualId,
        karmaPoints: 0,
        bio: "",
        womenOnly: false,
    };
    const profile = await profileRepo.insert(insertProfile);
    return profile.rows[0];
}

/**
 * Return true if password is correct for given
 * user. The user is specified by their userId address.
 * @param {number} userId
 * @param {string} inputPassword
 * @return {boolean} true if password is correct
 * @throws {error} if user with userId not found
 * @throws {error} if invalid query
 */
async function isCorrectPasswordById(userId, inputPassword) {
    const userResult = await userRepo.findById(userId);
    return isCorrectPassword(userResult.rows[0], inputPassword);
}

/**
 * Return true if password is correct for given
 * user. The user is specified by their email address.
 * @param {email} email
 * @param {string} inputPassword
 * @return {boolean} true if password is correct
 * @throws {error} if user with userId not found
 * @throws {error} if invalid query
 */
async function isCorrectPasswordByEmail(email, inputPassword) {
    const userResult = await userRepo.findByEmail(email);
    return isCorrectPassword(userResult.rows[0], inputPassword);
}

/**
 * Return true if password correct for user.
 * The user is passed as a user object.
 * This throws and error if user is undefined indicating
 * that it was not found in the database.
 * @param {Object} user
 * @param {string} inputPassword
 * @throws {error} if user is undefined
 * @return {boolean} true if correct password
 */
function isCorrectPassword(user, inputPassword) {
    if (user === undefined) {
        throw new Error("User by given email/id not found");
    }
    return (user.passwordHash === digest.hashPassWithSaltInHex(inputPassword, user.salt));
}

/**
 * Update password for given user.
 * This also updates the salt for
 * this user.
 * @param {number} userId
 * @param {String} password
 * @throws {error} if invalid query
 */
async function updatePassword(userId, password) {
    const secureSalt = digest.generateSecureSaltInHex();
    const hashedPassword = digest.hashPassWithSaltInHex(
        password,
        secureSalt,
    );
    await userRepo.updatePassword(userId, hashedPassword, secureSalt);
}

const signIn = async (email, password) => {
    const userResult = await userRepo.findByEmail(email);
    const user = userResult.rows[0];
    if (isCorrectPassword(user, password)) {
        const authToken = await authAgent.logIn(user.id);
        return ({
            status: 200,
            message: "Successful authentication with email & password.",
            userId: user.id,
            authToken: authToken,
        });
    } else {
        return ({
            status: 400,
            message: "Invalid password.",
        });
    }
};

module.exports = {
    registerEmail,
    registerUser,
    registerIndividual,
    registerOrg,
    isCorrectPasswordById,
    isCorrectPasswordByEmail,
    updatePassword,
    registerAddress,
    signIn,
};
