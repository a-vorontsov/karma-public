const digest = require("./digest");
const regStatus = require("./registration-status");
const regRepo = require("../../models/databaseRepositories/registrationRepository");
const userRepo = require("../../models/databaseRepositories/userRepository");
const individualRepo = require("../../models/databaseRepositories/individualRepository");
const orgRepo = require("../../models/databaseRepositories/organisationRepository");
const addressRepo = require("../../models/databaseRepositories/addressRepository");
const date = require("date-and-time");

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
    await regRepo.insert({
        email: email,
        email_flag: 0,
        id_flag: 0,
        phone_flag: 0,
        sign_up_flag: 0,
    });
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
        password_hash: hashedPassword,
        verified: false,
        salt: secureSalt,
        date_registered: date.format(new Date(), "YYYY-MM-DD HH:mm:ss", true),
    });
    const userResult = await userRepo.findByEmail(email);
    return userResult.rows[0].id;
}

/**
 * Register a new individual.
 * @param {number} userId
 * @param {string} title
 * @param {string} firstName
 * @param {string} surName
 * @param {Date} dateOfBirth
 * @param {string} gender
 * @param {string} addressLine1
 * @param {string} addressLine2
 * @param {string} townCity
 * @param {string} countryState
 * @param {string} postCode
 * @param {string} phoneNumber
 * @throws {error} if already registered
 * @throws {error} if invalid query
 */
async function registerIndividual(userId, title, firstName, surName, dateOfBirth, gender,
    addressLine1, addressLine2, townCity, countryState, postCode, phoneNumber) {
    if (await regStatus.isFullyRegisteredById(userId)) {
        throw new Error("Invalid operation: already fully registered.");
    }

    const addressResult = await registerAddress(addressLine1, addressLine2, townCity, countryState, postCode);
    const addressId = addressResult.rows[0].id;

    await individualRepo.insert({
        firstname: firstName,
        lastname: surName,
        phone: phoneNumber,
        banned: false,
        user_id: userId,
        picture_id: null, // TODO:
        address_id: addressId,
        birthday: dateOfBirth,
        gender: gender,
    });

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
 * @param {string} organisationNumber //TODO: string?
 * @param {string} name
 * @param {string} addressLine1
 * @param {string} addressLine2
 * @param {string} organisationType
 * @param {string} lowIncome
 * @param {string} exempt
 * @param {string} pocFirstName
 * @param {string} pocLastName
 * @param {string} townCity
 * @param {string} countryState
 * @param {string} postCode
 * @param {string} phoneNumber
 */
async function registerOrg(userId, organisationNumber, name, addressLine1, addressLine2, organisationType,
    lowIncome, exempt, pocFirstName, pocLastName, townCity, countryState, postCode, phoneNumber) {
    if (await regStatus.isFullyRegisteredById(userId)) {
        throw new Error("Invalid operation: already fully registered.");
    }

    const addressResult = await registerAddress(addressLine1, addressLine2, townCity, countryState, postCode);
    const addressId = addressResult.rows[0].id;

    await orgRepo.insert({
        org_name: name,
        org_number: organisationNumber,
        org_type: organisationType,
        poc_firstname: pocFirstName,
        poc_lastname: pocLastName,
        phone: phoneNumber,
        banned: false,
        org_register_date: date.format(new Date(), "YYYY-MM-DD HH:mm:ss", true),
        low_income: lowIncome,
        exempt: exempt,
        picture_id: null, // TODO:
        user_id: userId,
        address_id: addressId,
    });

    await setSignUpFlagTrue(userId);
}

/**
 * Register address and return it's id.
 * @param {string} addressLine1
 * @param {string} addressLine2
 * @param {string} townCity
 * @param {string} countryState
 * @param {string} postCode
 * @return {number} addressId
 */
async function registerAddress(addressLine1, addressLine2, townCity, countryState, postCode) {
    return await addressRepo.insert({
        address_1: addressLine1,
        address_2: addressLine2,
        postcode: postCode,
        city: townCity,
        region: countryState,
        lat: 0, // TODO: compute here?
        long: 0,
    });
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
    return (user.password_hash === digest.hashPassWithSaltInHex(inputPassword, user.salt));
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

/**
 * Get userId of user specified by email address.
 * @param {string} email
 * @return {number} userId
 * @throws {error} if user is not found
 * @throws {error} if invalid query
 */
async function getUserId(email) {
    const userResult = await userRepo.findByEmail(email);
    const userRecord = userResult.rows[0];
    return userRecord.id;
}

module.exports = {
    registerEmail: registerEmail,
    registerUser: registerUser,
    registerIndividual: registerIndividual,
    registerOrg: registerOrg,
    isCorrectPasswordById: isCorrectPasswordById,
    isCorrectPasswordByEmail: isCorrectPasswordByEmail,
    updatePassword: updatePassword,
    getUserId: getUserId,
};
