const userRepository = require("../models/userRepository");
const individualRepository = require("../models/individualRepository");
const organisationRepository = require("../models/organisationRepository");

const isIndividual = async (userId) => {
    const userResult = await userRepository.findById(userId);
    if (userResult.rows.length === 0) {
        throw Error(`No user with id ${userId} exists`);
    }
    const individualResult = await individualRepository.findByUserID(userId);
    return individualResult.rows.length > 0; // found at least one individual with userId
};

const isOrganisation = async (userId) => {
    const userResult = await userRepository.findById(userId);
    if (userResult.rows.length === 0) {
        throw Error(`No user with id ${userId} exists`);
    }
    const organisationResult = await organisationRepository.findByUserID(userId);
    return organisationResult.rows.length > 0; // found at least one organisation with userId
};

module.exports = {
    isIndividual: isIndividual,
    isOrganisation: isOrganisation,
};
