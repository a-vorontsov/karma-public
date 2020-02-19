const db = require("../database/connection");
const userRepository = require("./userRepository");

beforeEach(() => {
    db.query("DELETE FROM \"user\"");
});

afterEach(() => {
    db.query("DELETE FROM \"user\"");
});

test('insert user and findById user work', async () => {
    const user = {
        email: "test@gmail.com",
        username: "test1",
        password_hash: "password",
        verified: true,
        salt: "password",
        date_registered: "2016-06-22 19:10:25-07",
    };
    const insertUserResult = await userRepository.insert(user);
    const findUserResult = await userRepository.findById(insertUserResult.rows[0].id);
    expect(insertUserResult.rows[0]).toMatchObject(findUserResult.rows[0]);
});

test('find all users', async () => {
    const user1 = {
        email: "testersd@gmail.com",
        username: "test1hak",
        password_hash: "password",
        verified: true,
        salt: "password",
        date_registered: "2016-06-22 19:10:25-07",
    };

    const user2 = {
        email: "user@gmail.com",
        username: "user",
        password_hash: "password",
        verified: true,
        salt: "password",
        date_registered: "2016-06-22 19:10:25-07",
    };
    const insertUserResult1 = await userRepository.insert(user1);
    const insertUserResult2 = await userRepository.insert(user2);
    const findUserResult = await userRepository.findAll();
    expect(insertUserResult1.rows[0]).toMatchObject(findUserResult.rows[0]);
    expect(insertUserResult2.rows[0]).toMatchObject(findUserResult.rows[1]);
});
