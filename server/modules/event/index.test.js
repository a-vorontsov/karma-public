const testHelpers = require("../../test/helpers");
const eventService = require("./");

const eventRepository = require("../../repositories/event");
const eventCauseRepository = require("../../repositories/event/cause");
const favouriteRepository = require("../../repositories/favourite");
const signUpRepository = require("../../repositories/event/signup");
const addressRepository = require("../../repositories/address");
const selectedCauseRepository = require("../../repositories/cause/selected");
const eventSorter = require("../sorting");
const util = require("../../util");
const filterer = require("../filtering");


jest.mock("../../repositories/event");
jest.mock("../../repositories/address");
jest.mock("../../repositories/event/signup");
jest.mock("../../repositories/cause/selected");
jest.mock("../../repositories/favourite");
jest.mock("../../repositories/event/cause");
jest.mock("../../util");
jest.mock("../filtering");
jest.mock("../sorting");

let address, event, signUp, eventWithAllData, peaceEvent, animalsEvent, cause;

beforeEach(() => {
    signUp = testHelpers.getSignUp();
    address = testHelpers.getAddress();
    event = testHelpers.getEvent();
    eventWithAllData = testHelpers.getEventWithAllData();
    peaceEvent = testHelpers.getPeaceEvent();
    animalsEvent = testHelpers.getAnimalsEvent();
    cause = testHelpers.getCause();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("creating event with known address works", async () => {
    util.checkUserId.mockResolvedValue({status: 200});
    util.isIndividual.mockResolvedValue(false);
    event.addressId = 1;
    event.causes = [1,2,3];
    eventRepository.insert.mockResolvedValue({
        rows: [{
            ...event,
            id: 1,
        }],
    });

    eventCauseRepository.insert.mockResolvedValue({
        rows: [{
            eventId: 1,
            causeId: 2,
        }],
    });

    const createEventResult = await eventService.createNewEvent(event);
    createEventResult.data.event.creationDate = event.creationDate;
    expect(eventCauseRepository.insert).toHaveBeenCalledTimes(3);
    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(0);
    expect(createEventResult.data.event).toMatchObject({
        ...event,
        id: 1,
    });
    expect(createEventResult.status).toBe(200);
});

test("creating event with no addressId creates new address and event", async () => {
    util.checkUserId.mockResolvedValue({status: 200});
    util.isIndividual.mockResolvedValue(false);
    event.causes = [1,2,3];
    const eventNoAddressId = {
        ...event,
        address: address,
    };
    delete eventNoAddressId.addressId;
    const mockAddress = {
        ...address,
        id: 1,
    };
    addressRepository.insert.mockResolvedValue({
        rows: [mockAddress],
    });
    eventRepository.insert.mockResolvedValue({
        rows: [{
            ...event,
            id: 1,
        }],
    });

    eventCauseRepository.insert.mockResolvedValue({
        rows: [{
            eventId: 1,
            causeId: 2,
        }],
    });

    const createEventResult = await eventService.createNewEvent(eventNoAddressId);

    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(1);
    expect(createEventResult.data.event).toMatchObject({
        ...event,
        id: 1,
    });
    expect(eventCauseRepository.insert).toHaveBeenCalledTimes(3);
    expect(createEventResult.status).toBe(200);
});

test("updating events works", async () => {
    const mockAddress = {
        ...address,
        id: 1,
    };
    event.address = mockAddress;
    event.addressId = mockAddress.id;

    addressRepository.update.mockResolvedValue({
        rows: [mockAddress],
    });
    eventRepository.update.mockResolvedValue({
        rows: [{
            ...event,
            id: 3,
        }],
    });

    const updateEventResult = await eventService.updateEvent(event);

    expect(eventRepository.update).toHaveBeenCalledTimes(1);
    expect(addressRepository.update).toHaveBeenCalledTimes(1);
    expect(updateEventResult.data.event).toMatchObject({
        ...event,
        id: 3,
    });
    expect(updateEventResult.status).toBe(200);
});

test("requesting specific event data works", async () => {
    event.spotsRemaining = NaN;
    eventRepository.findById.mockResolvedValue({
        rows: [{
            ...event,
            id: 3,
        }],
    });
    signUpRepository.findAllByEventIdConfirmed.mockResolvedValue({
        rows: [{
            ...signUp,
            id: 1,
        }],
    });
    signUpRepository.findUsersSignedUpConfirmed.mockResolvedValue({
        rows: [{
            ...event,
            id: 1,
        }],
    });
    addressRepository.findById.mockResolvedValue({
        rows: [address],
    });

    eventCauseRepository.findCausesByEventId.mockResolvedValue({
        rows: [{
            causeId: 1,
            causeId: 2,
        }],
    });
    const getEventResult = await eventService.getEventData(3);

    expect(signUpRepository.findAllByEventIdConfirmed).toHaveBeenCalledTimes(1);
    expect(eventRepository.findById).toHaveBeenCalledTimes(1);
    expect(eventRepository.findById).toHaveBeenCalledWith(3);
    expect(addressRepository.findById).toHaveBeenCalledWith(event.addressId);
    expect(getEventResult.data.event).toMatchObject({
        address: address,
        ...event,
        id: 3,
    });
    expect(getEventResult.status).toBe(200);
});

test("error returned when user tries to exceed monthly event creation limit", async () => {
    util.checkUserId.mockResolvedValue({status: 200});
    util.isIndividual.mockResolvedValue(true);
    eventRepository.findAllByUserIdLastMonth.mockResolvedValue({
        rows: [{}, {}, {}, {}],
    }); // 4 events

    const createEventResult = await eventService.createNewEvent(event);
    expect(createEventResult.message).toBe("Event creation limit reached; user has already created 3 events this month.");
    expect(createEventResult.status).toBe(400);
});

test("requests with invalid userIds rejected", async () => {
    util.checkUserId.mockResolvedValue({status: 400, message: "Invalid userId specified."});

    const createEventResult = await eventService.createNewEvent(event);
    expect(createEventResult.message).toBe("Invalid userId specified.");
    expect(createEventResult.status).toBe(400);
});

test("getting all events works", async () => {
    const eventsArray =[{
        ...eventWithAllData,
        favourited: [1],
        id: 1,
    },
    {
        ...eventWithAllData,
        favourited: [1],
        id: 2,
    }];
    util.checkUser.mockResolvedValue({status: 200});
    filterer.getWhereClause.mockResolvedValue("");
    eventRepository.findAllWithAllData.mockResolvedValue({
        rows: eventsArray,
    });
    eventSorter.sortByTimeAndDistance.mockResolvedValue(eventsArray)
    const getEventsResult = await eventService.getEvents({},1);

    expect(util.checkUser).toHaveBeenCalledTimes(1);
    expect(eventRepository.findAllWithAllData).toHaveBeenCalledTimes(1);
    expect(filterer.getWhereClause).toHaveBeenCalledWith({});
    expect(filterer.getWhereClause).toHaveBeenCalledTimes(1);
    eventsArray[0].favourited = true;
    eventsArray[1].favourited = true;
    expect(getEventsResult.data.events).toMatchObject(eventsArray);
    expect(getEventsResult.status).toBe(200);
});

test("getting events grouped by user selected causes works", async () => {
    const eventsArray =[{
        ...animalsEvent,
        favourited: [1],
        id: 1,
    },
    {
        ...peaceEvent,
        favourited: [1],
        id: 2,
    }];
    util.checkUser.mockResolvedValue({status: 200});
    filterer.getWhereClause.mockResolvedValue("");
    selectedCauseRepository.findEventsSelectedByUser.mockResolvedValue({
        rows: eventsArray,
    });
    eventSorter.sortByTimeAndDistance.mockResolvedValue(eventsArray);
    eventSorter.groupByCause.mockResolvedValue(
        {
            animals:[{
                ...animalsEvent,
                id: 1,
            }],
            peace:[{
                ...peaceEvent,
                id: 2,
            }]
        }
    )
    const getEventsResult = await eventService.getEventsBySelectedCauses({},1);
    expect(util.checkUser).toHaveBeenCalledTimes(1);
    expect(selectedCauseRepository.findEventsSelectedByUser).toHaveBeenCalledTimes(1);
    expect(filterer.getWhereClause).toHaveBeenCalledWith({});
    expect(filterer.getWhereClause).toHaveBeenCalledTimes(1);
    expect(getEventsResult.data).toStrictEqual({
        animals:[{
            ...animalsEvent,
            id: 1,
        }],
        peace:[{
            ...peaceEvent,
            id: 2,
        }]
    });
    expect(getEventsResult.status).toBe(200);
});

test("deleting events works", async () => {

    util.checkEventId.mockResolvedValue({status: 200});
    eventRepository.removeById.mockResolvedValue({
        rows: [{
            ...event,
            id: 3,
        }],
    });

    const deleteResult = await eventService.deleteEvent(3);
    expect(eventRepository.removeById).toHaveBeenCalledTimes(1);
    expect(favouriteRepository.removeByEventId).toHaveBeenCalledTimes(1);
    expect(signUpRepository.removeByEventId).toHaveBeenCalledTimes(1);
    expect(eventCauseRepository.removeByEventId).toHaveBeenCalledTimes(1);
    expect(deleteResult.data.event).toMatchObject({
        ...event,
        id: 3,
    });
    expect(deleteResult.message).toBe("Event deleted successfully");
    expect(deleteResult.status).toBe(200);
});
