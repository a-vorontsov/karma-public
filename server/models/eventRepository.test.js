const addressRepository = require("./addressRepository");
const eventRepository = require("./eventRepository");
const testHelpers = require("../test/testHelpers");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert and findById work', async () => {
    const address = testHelpers.address;
    const event = testHelpers.event;
    const insertAddressResult = await addressRepository.insert(address);
    event.address_id =  insertAddressResult.rows[0].id;
    event.organisation_id = 3;
    const insertEventResult = await eventRepository.insert(event);
    const findEventResult = await eventRepository.findById(insertEventResult.rows[0].id);
    expect(insertEventResult.rows[0]).toMatchObject(findEventResult.rows[0]);
});