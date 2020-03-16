const testHelpers = require("../../../test/testHelpers");
const eventFavouriteService = require("./eventFavouriteService");

const favouriteRepository = require("../../../models/databaseRepositories/favouriteRepository");
const util = require("../../../util/util");

jest.mock("../../../models/databaseRepositories/favouriteRepository");
jest.mock("../../../util/util");


let favourite;

beforeEach(() => {
    favourite = testHelpers.getFavourite();
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
