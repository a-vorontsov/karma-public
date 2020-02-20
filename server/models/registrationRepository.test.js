const registrationRepository = require("./registrationRepository");
const testHelpers = require("../test/testHelpers");

const registration = testHelpers.registration;
const registration2 = testHelpers.registration2;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert registration and findByEmail registration work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registration);
    const findRegistrationResult = await registrationRepository.findByEmail(insertRegistrationResult.rows[0].email);
    expect(insertRegistrationResult.rows[0]).toMatchObject(findRegistrationResult.rows[0]);
});

test('find all registrations', async () => {
    const insertRegistrationResult1 = await registrationRepository.insert(registration);
    const insertRegistrationResult2 = await registrationRepository.insert(registration2);
    const findRegistrationResult = await registrationRepository.findAll();
    expect(insertRegistrationResult1.rows[0]).toMatchObject(findRegistrationResult.rows[0]);
    expect(insertRegistrationResult2.rows[0]).toMatchObject(findRegistrationResult.rows[1]);
});
