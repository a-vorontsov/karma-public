const testHelpers = require("../../../test/helpers");
const eventFavouriteService = require("./");
const eventSorter = require("../../sorting");
const individualRepository = require("../../../repositories/individual");
const favouriteRepository = require("../../../repositories/favourite");
const util = require("../../../util");

jest.mock("../../../repositories/favourite");
jest.mock("../../../repositories/individual");
jest.mock("../../sorting");
jest.mock("../../../util");


let favourite, event1, event2;

beforeEach(() => {
    favourite = testHelpers.getFavourite();
    event1 = testHelpers.getEventWithLocationExample1();
    event2 = testHelpers.getEventWithLocationExample2();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('creating favourite works', async () => {
    util.checkEventId.mockResolvedValue({status: 200});
    favouriteRepository.insert.mockResolvedValue({
        rows: [favourite],
    });

    const createFavouriteResult = await eventFavouriteService.createEventFavourite(favourite);

    expect(favouriteRepository.insert).toHaveBeenCalledTimes(1);
    expect(createFavouriteResult.data).toMatchObject({
        favourite
    });
    expect(createFavouriteResult.status).toBe(200);
});

test('deleting favourite works', async () => {
    util.checkEventId.mockResolvedValue({status: 200});
    favouriteRepository.remove.mockResolvedValue({
        rows: [favourite],
    });

    const deleteFavouriteResult = await eventFavouriteService.deleteEventFavourite(favourite);

    expect(favouriteRepository.remove).toHaveBeenCalledTimes(1);
    expect(deleteFavouriteResult.data).toMatchObject({
        favourite
    });
    expect(deleteFavouriteResult.status).toBe(200);
});

test('getting events user favourited works', async () => {
    const eventsArray =[{
        ...event1,
        eventid: 1,
    },
    {
        ...event2,
        eventid: 2,
    }];

    util.checkUser.mockResolvedValue({status: 200});
    individualRepository.findFavouriteEvents.mockResolvedValue({rows: eventsArray});
    eventSorter.sortByTimeAndDistance.mockResolvedValue(eventsArray)
    const getFavouriteEventsResult = await eventFavouriteService.getFavouriteEvents(15);

    expect(individualRepository.findFavouriteEvents).toHaveBeenCalledTimes(1);
    expect(getFavouriteEventsResult.status).toBe(200);
    expect(getFavouriteEventsResult.data.events).toMatchObject(eventsArray);
});
