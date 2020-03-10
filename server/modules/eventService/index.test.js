const testHelpers = require("../../test/testHelpers");
const eventService = require("./");

const eventRepository = require("../../models/databaseRepositories/eventRepository");
const addressRepository = require("../../models/databaseRepositories/addressRepository");
const util = require("../../util/util");


jest.mock("../../models/databaseRepositories/eventRepository");
jest.mock("../../models/databaseRepositories/addressRepository");
jest.mock("../../util/util");

let address, event;

beforeEach(() => {
    address = testHelpers.getAddress();
    event = testHelpers.getEvent();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("creating event with known address works", async () => {
    util.isIndividual.mockResolvedValue(false);
    event.addressId = 1;
    eventRepository.insert.mockResolvedValue({
        rows: [{
            ...event,
            id: 1,
        }],
    });

    const createEventResult = await eventService.createNewEvent(event);
    createEventResult.data.event.creationDate = event.creationDate;

    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(0);
    expect(createEventResult.data.event).toMatchObject({
        ...event,
        id: 1,
    });
    expect(createEventResult.status).toBe(200);
});

test("creating event with no addressId creates new address and event", async () => {
    util.isIndividual.mockResolvedValue(false);
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

    const createEventResult = await eventService.createNewEvent(eventNoAddressId);

    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(1);
    expect(createEventResult.data.event).toMatchObject({
        ...event,
        id: 1,
    });
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
    eventRepository.findById.mockResolvedValue({
        rows: [{
            ...event,
            id: 3,
        }],
    });
    addressRepository.findById.mockResolvedValue({
        rows: [address],
    });

    const getEventResult = await eventService.getEventData(3);

    expect(eventRepository.findById).toHaveBeenCalledTimes(1);
    expect(eventRepository.findById).toHaveBeenCalledWith(3);
    expect(addressRepository.findById).toHaveBeenCalledWith(event.addressId);
    expect(getEventResult.data.event).toMatchObject({
        ...event,
        id: 3,
    });
    expect(getEventResult.status).toBe(200);
});

test("error returned when user tries to exceed monthly event creation limit", async () => {
    util.isIndividual.mockResolvedValue(true);
    eventRepository.findAllByUserId.mockResolvedValue({
        rows: [{}, {}, {}, {}],
    }); // 4 events

    const createEventResult = await eventService.createNewEvent(event);

    expect(createEventResult.status).toBe(400);
});
