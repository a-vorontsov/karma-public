const favouriteRepository = require("../../../models/databaseRepositories/favouriteRepository");
const util = require("../../../util/util");

/**
 * Creates a new event favourite to be added to the database.
 * @param {object} favouriteRequest An object containing a valid individualId and a valid eventId.
 * Fails if eventId is invalid, or database call fails.
 */
const createEventFavourite = async (favouriteRequest) => {
    const eventIdCheckResponse = await util.checkEventId(favouriteRequest.eventId);
    if (eventIdCheckResponse.status !== 200) {
        return eventIdCheckResponse;
    }

    const favouriteResult = await favouriteRepository.insert(favouriteRequest);
    return ({
        status: 200,
        message: "Favourite added successfully",
        data: {favourite: favouriteResult.rows[0]},
    });
};

/**
 * Delete an event favourite from the database.
 * @param {object} deleteFavouriteRequest An object containing a valid individualId and a valid eventId.
 * Fails if eventId is invalid, or database call fails.
 */
const deleteEventFavourite = async (deleteFavouriteRequest) => {
    const eventIdCheckResponse = await util.checkEventId(deleteFavouriteRequest.eventId);
    if (eventIdCheckResponse.status !== 200) {
        return eventIdCheckResponse;
    }

    const deleteFavouriteResult = await favouriteRepository.remove(deleteFavouriteRequest);
    return ({
        status: 200,
        message: "Event unfavourited successfully",
        data: {favourite: deleteFavouriteResult.rows[0]},
    });
};

module.exports = {
    createEventFavourite,
    deleteEventFavourite,
};
