const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const util = require("../../util/util");

const addressRepository = require("../../models/addressRepository");
const eventRepository = require("../../models/eventRepository");
const selectedCauseRepository = require("../../models/selectedCauseRepository");
const individualRepository = require("../../models/individualRepository");
const userRepository = require("../../models/userRepository");


jest.mock("../../models/eventRepository");
jest.mock("../../models/addressRepository");
jest.mock("../../models/selectedCauseRepository");
jest.mock("../../models/individualRepository");
jest.mock("../../models/userRepository");
jest.mock("../../util/util");

beforeEach(() => {
  return testHelpers.clearDatabase();
});

afterEach(() => {
  jest.clearAllMocks();
  return testHelpers.clearDatabase();
});

const eventWithLocation = testHelpers.eventWithLocation1;
const eventWithLocation2 = testHelpers.eventWithLocation2;
const address = testHelpers.address;
const event = testHelpers.event;
event.organization_id = 1;
event.address_id = 1;

test("creating event with known address works", async () => {
  eventRepository.insert.mockResolvedValue({
    rows: [{
      ...event,
      id: 1
    }]
  });
  const response = await request(app)
    .post("/event")
    .send(event);

  expect(eventRepository.insert).toHaveBeenCalledTimes(1);
  expect(addressRepository.insert).toHaveBeenCalledTimes(0);
  expect(response.body).toMatchObject({
    ...event,
    id: 1
  });
  expect(response.statusCode).toBe(200);
});

test("updating events works", async () => {
  const mockAddress = {
    ...address,
    id: 1
  };
  addressRepository.update.mockResolvedValue({
    rows: [mockAddress]
  });
  eventRepository.update.mockResolvedValue({
    rows: [{
      ...event,
      id: 3
    }]
  });

  const response = await request(app)
    .post("/event/update/3")
    .send({
      event,
      address: mockAddress
    });

  expect(eventRepository.update).toHaveBeenCalledTimes(1);
  expect(addressRepository.update).toHaveBeenCalledTimes(1);
  expect(response.body).toMatchObject({
    ...event,
    id: 3
  });

  expect(response.statusCode).toBe(200);
});

test("requesting specific event data works", async () => {
  eventRepository.findById.mockResolvedValue({
    rows: [{
      ...event,
      id: 3
    }]
  });
  addressRepository.findById.mockResolvedValue({
    rows: [address]
  });
  const response = await request(app).get("/event/3");

  expect(eventRepository.findById).toHaveBeenCalledTimes(1);
  expect(eventRepository.findById).toHaveBeenCalledWith("3");
  expect(addressRepository.findById).toHaveBeenCalledWith(event.address_id);
  expect(response.statusCode).toBe(200);
  expect(response.body).toMatchObject({
    ...event,
    id: 3
  });
});

test("error returned when user tries to exceed monthly event creation limit", async () => {
  util.isIndividual.mockResolvedValue(true);
  eventRepository.findAllByUserId.mockResolvedValue({
    rows: [{}, {}, {}, {}]
  }); // 4 events
  const response = await request(app)
    .post("/event")
    .send(event);
  expect(response.statusCode).toBe(400);
});

test("creating event with no address_id creates new address and event", async () => {
  util.isIndividual.mockResolvedValue(false);
  const eventNoAddressId = {
    ...event
  };
  delete eventNoAddressId.address_id;
  const mockAddress = {
    ...address,
    id: 1
  };
  addressRepository.insert.mockResolvedValue({
    rows: [mockAddress]
  });
  eventRepository.insert.mockResolvedValue({
    rows: [{
      ...event,
      id: 1
    }]
  });

  const response = await request(app)
    .post("/event")
    .send(eventNoAddressId);

  expect(eventRepository.insert).toHaveBeenCalledTimes(1);
  expect(addressRepository.insert).toHaveBeenCalledTimes(1);
  expect(response.body).toMatchObject({
    ...event,
    id: 1
  });
  expect(response.statusCode).toBe(200);
});

test("getting all events works", async () => {
  userRepository.getUserLocation.mockResolvedValue({
    rows: [{
      id: 1,
      lat: 51.414916,
      long: -0.190487,
    }]
  });
  eventRepository.getEventsWithLocation.mockResolvedValue({
    rows: [eventWithLocation, eventWithLocation2]
  });
  const response = await request(app).get("/event?userId=1");
  expect(eventRepository.getEventsWithLocation).toHaveBeenCalledTimes(1);
  expect(userRepository.getUserLocation).toHaveBeenCalledTimes(1);
  expect(response.statusCode).toBe(200);
  expect(response.body.data).toMatchObject([eventWithLocation, eventWithLocation2]);
});

test("getting events grouped by causes selected by user works", async () => {
  util.checkUserId.mockResolvedValue({
    status: 200,
    user: {
      id: 1,
      lat: 51.414916,
      long: -0.190487,
    }
  });
  userRepository.get
  selectedCauseRepository.findEventsSelectedByUser.mockResolvedValue({
    rows: [eventWithLocation, eventWithLocation2]
  });
  const response = await request(app).get("/event/causes?userId=1");
  expect(selectedCauseRepository.findEventsSelectedByUser).toHaveBeenCalledTimes(1);
  expect(response.statusCode).toBe(200);
  expect(response.body).toMatchObject({
    peace: [{
      ...eventWithLocation
    }],
    gardening: [{
      ...eventWithLocation2
    }],
  });
});

test("getting events favourited by user works", async () => {
  util.checkUserId.mockResolvedValue({
    status: 200,
    user: {
      id: 1,
      lat: 51.414916,
      long: -0.190487,
    }
  });
  individualRepository.findFavouriteEvents.mockResolvedValue({
    rows: [eventWithLocation, eventWithLocation2]
  });
  const response = await request(app).get("/event/favourites?userId=1");
  expect(individualRepository.findFavouriteEvents).toHaveBeenCalledTimes(1);
  expect(response.statusCode).toBe(200);
  expect(response.body).toMatchObject(
    [eventWithLocation, eventWithLocation2]
  );
});

test("getting events user is going to works", async () => {
  util.checkUserId.mockResolvedValue({
    status: 200,
    user: {
      id: 1,
      lat: 51.414916,
      long: -0.190487,
    }
  });
  individualRepository.findGoingEvents.mockResolvedValue({
    rows: [eventWithLocation, eventWithLocation2]
  });
  const response = await request(app).get("/event/going?userId=1");
  expect(individualRepository.findGoingEvents).toHaveBeenCalledTimes(1);
  expect(response.statusCode).toBe(200);
  expect(response.body).toMatchObject(
    [eventWithLocation, eventWithLocation2]
  );
});
