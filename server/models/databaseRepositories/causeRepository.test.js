const testHelpers = require("../../test/testHelpers");
const selectedCauseRepository = require("./selectedCauseRepository");
const causeRepository = require("./causeRepository");

const cause = testHelpers.cause;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert works', async () => {
    const insertResult = await causeRepository.insert(cause);
    const cause_id = insertResult.rows[0].id;
    expect(insertResult.rows[0]).toMatchObject({
        'id': cause_id,
        ...cause
    });
});

test('find works', async () => {
    const insertResult = await causeRepository.insert(cause);
    const cause_id = insertResult.rows[0].id;
    const findAllResult = await causeRepository.findAll();
    const findByIdResult = await causeRepository.findById(cause_id);
    const findByNameResult = await causeRepository.findByName(cause.name);
    expect(findAllResult.rows[0]).toMatchObject({
        'id': cause_id,
        ...cause
    })
    expect(findByIdResult.rows[0]).toMatchObject({
        'id': cause_id,
        ...cause
    })
    expect(findByNameResult.rows[0]).toMatchObject({
        'id': cause_id,
        ...cause
    })
});
