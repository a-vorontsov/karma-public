const userRepository = require("../../models/databaseRepositories/userRepository");
const individualRepository = require("../../models/databaseRepositories/individualRepository");

/**
 * This fetches all users signed up to Karma.
 */
const getAllUsers = async () => {
    const users = await userRepository.findAll();
    return ({
        message: "Users fetched successfully",
        status: 200,
        data: {users: users.rows},
    });
};


/**
 * This fetches all individuals signed up to Karma.
 */
const getAllIndividuals = async () => {
    const individuals = await individualRepository.findAll();
    individuals.rows.sort((a, b) => a.id - b.id);
    return ({
        message: "Individuals fetched successfully",
        status: 200,
        data: {individuals: individuals.rows},
    });
};

/**
 * This bans an individual.
 * @param {Object} individual The individual an administrator wishes to ban.
 */
const toggleIndividualBan = async (individual) => {
    individual.banned = !individual.banned;
    const individualResult = await individualRepository.update(individual);
    return ({
        message: "Individual banned successfully",
        status: 200,
        data: {individual: individualResult.rows[0]},
    });
};

module.exports = {
    getAllUsers,
    getAllIndividuals,
    toggleIndividualBan,
};
