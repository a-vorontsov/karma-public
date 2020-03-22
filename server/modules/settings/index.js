const settingsRepository = require("../../models/databaseRepositories/settingsRepository");

/**
 * Updates the current settings for a user.
 * @param {object} settings object
 * Fails if something goes wrong in db.
 */
const changeSettings = async (settings) => {

    const currentSettings = await settingsRepository.findByUserId(settings.userId);
    if (settings.email !== undefined) {
        currentSettings.email = settings.email;
    }
    if (settings.notification !== undefined) {
        currentSettings.notification = settings.notification;
    }
    const settingsResult = await settingsRepository.update(settings);
    return ({
        status: 200,
        message: "Settings updated successfully.",
        data: {settings: settingsResult.rows[0]},
    });
};

/**
 * Gets the current settings for a user.
 * @param {Number} userId
 * Fails if database calls fail.
 */
const getCurrentSettings = async (userId) => {
    const settingsResult = await settingsRepository.findByUserId(userId);
    const settings = settingsResult.rows[0];
    return ({
        status: 200,
        message: "Settings fetched successfully",
        data: {settings},
    });
};

module.exports = {
    changeSettings,
    getCurrentSettings,
};
