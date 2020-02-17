const addressRepository = require("./addressRepository");
const testHelpers = require("../test/testHelpers");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert and findById work', async () => {
    const address = testHelpers.address;
    const insertResult = await addressRepository.insert(address);
    const findResult = await addressRepository.findById(insertResult.rows[0].id);
    expect(insertResult.rows[0]).toMatchObject(findResult.rows[0]);
});