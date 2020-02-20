const userRepository = require("./userRepository");
const testHelpers = require("../test/testHelpers");

beforeEach(() => {
   return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert user and findById user work', async () => {
    const user = testHelpers.user;
    const insertUserResult = await userRepository.insert(user);
    const findUserResult = await userRepository.findById(insertUserResult.rows[0].id);
    expect(insertUserResult.rows[0]).toMatchObject(findUserResult.rows[0]);
});

test('find all users', async () => {
    const user = testHelpers.user;
    const user2 = testHelpers.user2;
    const insertUserResult1 = await userRepository.insert(user);
    const insertUserResult2 = await userRepository.insert(user2);
    const findUserResult = await userRepository.findAll();
    expect(insertUserResult1.rows[0]).toMatchObject(findUserResult.rows[0]);
    expect(insertUserResult2.rows[0]).toMatchObject(findUserResult.rows[1]);
});
