const favouriteRepository = require("../../../models/databaseRepositories/favouriteRepository");
const individualRepository = require("../../../models/databaseRepositories/individualRepository");
const util = require("../../../util/util");
const eventSorter = require("../../sorting/event");
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


/**
 * Gets data about all events in the database.
 * @param {Number} userId id of the user
 * @return {object} result in httpUtil's sendResult format
 * Fails if database calls fail.
 */
const getFavouriteEvents = async (userId) => {
    const userIdCheckResponse = await util.checkUserId(userId);
    if (userIdCheckResponse.status !== 200) userIdCheckResponse;


    const findResult = await individualRepository.findFavouriteEvents(userId);
    const events = findResult.rows;
    if (events.length === 0) return ({status: 404, message: "No favourite events found"});
    const user = userIdCheckResponse.user;
    eventSorter.sortByTimeAndDistance(events, user);
    return ({
        status: 200,
        message: "Favourite events fetched successfully",
        data: {events: events},
    });
};

module.exports = {
    createEventFavourite,
    deleteEventFavourite,
    getFavouriteEvents,
};
