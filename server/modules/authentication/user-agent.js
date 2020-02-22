const digest = require("./digest");
const regStatus = require("./registration-status");
const regRepo = require("../../models/registrationRepository");
const userRepo = require("../../models/userRepository");
const individualRepo = require("../../models/individualRepository");
const orgRepo = require("../../models/organisationRepository");
const addressRepo = require("../../models/addressRepository");

/**
 * Register a new record in the registration table.
 * @param {string} email
 * @throws {error} if email already stored
 * @throws {error} if invalid query
 */
function registerEmail(email) {
    if (regStatus.emailExists(email)) {
        throw new Error("Invalid operation: email already exists.");
    }
    regRepo.insert({
        email: email,
        email_flag: false,
        id_flag: false,
        phone_flag: false,
        sign_up_flag: false,
    });
}

/**
 * Register a new user with given email, username
 * and password, then return the new user's id.
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @return {integer} id of new user
 * @throws {error} if registration record not found
 * @throws {error} if already registered
 * @throws {error} if invalid query
 */
function registerUser(email, username, password) {
    if (regStatus.emailExists(email)) {
        throw new Error("Invalid operation: registration record not found.");
    }
    if (regStatus.isPartlyRegistered(email) || regStatus.isFullyRegistered(email)) {
        throw new Error("Invalid operation: user record already exists.");
    }
    const secureSalt = digest.getSecureSaltInHex();
    const hashedPassword = digest.hashPassWithSaltInHex(
        password,
        secureSalt,
    );
    userRepo.insert({
        email: email,
        username: username,
        password_hash: hashedPassword,
        verified: false,
        salt: secureSalt,
        date_registered: Date.now(),
    });
    return userRepo.findByEmail(email).id;
}

/**
 * Register a new individual.
 * @param {integer} userId
 * @param {string} title //TODO: string?
 * @param {string} firstName
 * @param {string} middleNames // TODO: not in DB
 * @param {string} surName
 * @param {Date} dateOfBirth
 * @param {string} gender //TODO: string?
 * @param {string} addressLine1
 * @param {string} addressLine2
 * @param {string} townCity
 * @param {string} countryState
 * @param {string} postCode
 * @param {string} phoneNumber
 * @throws {error} if already registered
 * @throws {error} if invalid query
 */
function registerIndividual(userId, title, firstName, middleNames, surName, dateOfBirth, gender, addressLine1, addressLine2, townCity, countryState, postCode, phoneNumber) {
    if (regStatus.isFullyRegistered(userId)) {
        throw new Error("Invalid operation: already fully registered.");
    }
    // register address and get it's id
    const addressId = registerAddress(addressLine1, addressLine2, townCity, countryState, postCode);

    individualRepo.insert({
        firstname: firstName,
        lastname: surName,
        phone: phoneNumber,
        banned: false,
        user_id: userId,
        picture_id: 0, // TODO: what to do here at this stage?
        address_id: addressId,
        birthday: dateOfBirth,
        gender: gender,
    });
}

/**
 * Register a new organisation
 * @param {integer} userId
 * @param {string} organisationNumber //TODO: string?
 * @param {string} name
 * @param {string} addressLine1
 * @param {string} addressLine2
 * @param {string} townCity
 * @param {string} countryState
 * @param {string} postCode
 * @param {string} phoneNumber
 */
function registerOrg(userId, organisationNumber, name, addressLine1, addressLine2, townCity, countryState, postCode, phoneNumber) {
    if (regStatus.isFullyRegistered(userId)) {
        throw new Error("Invalid operation: already fully registered.");
    }
    // register address and get it's id
    const addressId = registerAddress(addressLine1, addressLine2, townCity, countryState, postCode);
    orgRepo.insert({
        org_name: name,
        org_number: organisationNumber,
        org_type: "TODO:",
        poc_firstname: "TODO:",
        poc_lastname: "TODO:",
        phone: phoneNumber,
        banned: false,
        org_register_date: Date.now(),
        low_income: "TODO:",
        exempt: "TODO:",
        picture_id: 0, // TODO:
        user_id: userId,
        addressId: addressId,
    });
}

/**
 * Register address and return it's id.
 * @param {string} addressLine1
 * @param {string} addressLine2
 * @param {string} townCity
 * @param {string} countryState
 * @param {string} postCode
 * @return {integer} addressId
 */
function registerAddress(addressLine1, addressLine2, townCity, countryState, postCode) {
    return addressRepo.insert({
        address_1: addressLine1,
        address_2: addressLine2,
        postcode: postCode,
        city: townCity,
        region: countryState,
        lat: 0, // TODO: compute here?
        long: 0,
    }).id;
}

/**
 * Change a user's password
 * @param {integer} id
 * @param {string} secureSalt 256-bit
 * @param {string} hashedPassword 256-bit
 */
function changePassword(id, secureSalt, hashedPassword) {
    const user = findById(id);
    user.salt = secureSalt;
    user.password = hashedPassword;
}

/**
 * Update password for an already existing, logged-in
 * user.
 * @param {HTTP} req
 */
function updatePassword(req) {
    // TODO: push
    console.log("update password called");
}

/**
 * Returns true if input password is correct for given user.
 * @param {Object} user
 * @param {string} password 256-bit
 * @return {boolean} true if password is correct
 */
function isCorrectPassword(user, password) {
    return user.password === digest.hashPassWithSaltInHex(password, user.salt);
}

module.exports = {
    registerEmail: registerEmail,
    registerUser: registerUser,
    registerIndividual: registerIndividual,
    registerOrg: registerOrg,
};
