const request = require('supertest');
const app = require('../../app');
const testHelpers = require("../../test/testHelpers");

const userRepository = require("../../models/databaseRepositories/userRepository");
const resetRepository = require("../../models/databaseRepositories/resetRepository");
const mailSender = require("../../modules/mailSender");

jest.mock("../../models/databaseRepositories/resetRepository");
jest.mock("../../models/databaseRepositories/userRepository");
jest.mock("../../modules/mailSender");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const user = testHelpers.user;
const reset1 = testHelpers.reset1;
const reset2 = testHelpers.reset2;

test('requesting reset password token works', async () => {
    resetRepository.insertResetToken.mockResolvedValue({
        rows: [{
            ...reset1,
            id: 1,
        }],
    });
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    mailSender.sendToken.mockResolvedValue();
    const response = await request(app)
        .post("/signin/forgot")
        .send({
            email: "test@gmail.com"
        });

    expect(resetRepository.insertResetToken).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch("Code sent successfully to test@gmail.com");
});

test('requesting reset password token with no email does not work', async () => {
    const response = await request(app)
        .post("/signin/forgot")
        .send({});

    expect(resetRepository.insertResetToken).toHaveBeenCalledTimes(0);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch("No email was specified");
});

test('confirming correct token works', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findResetToken.mockResolvedValue({
        rows: [{
                ...reset2,
                id: 2,
                expiry_date: dateTime,
            },
            {
                ...reset1,
                id: 1,
                expiry_date: new Date(),
            }
        ],
    });
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            email: "test@gmail.com",
            token: "234567",
        });
    expect(resetRepository.findResetToken).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch("Token accepted");
});

test('confirming correct token but not latest does not work', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findResetToken.mockResolvedValue({
        rows: [{
                ...reset2,
                id: 2,
                expiry_date: dateTime,
            },
            {
                ...reset1,
                id: 1,
                expiry_date: new Date(),
            }
        ],
    })
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            email: "test@gmail.com",
            token: "123456",
        });
    expect(resetRepository.findResetToken).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(401);
    expect(response.text).toMatch("Tokens did not match");
});

test('confirming incorrect token returns incorrect token response', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findResetToken.mockResolvedValue({
        rows: [{
            ...reset1,
            id: 1,
            expiry_date: dateTime,
        }],
    })
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            email: "test@gmail.com",
            token: "incorrect token",
        });
    expect(resetRepository.findResetToken).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(401);
    expect(response.text).toMatch("Tokens did not match");
});

test('confirming expired token returns token expired response', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() - (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findResetToken.mockResolvedValue({
        rows: [{
            ...reset1,
            id: 1,
            expiry_date: dateTime,
        }],
    })
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            email: "test@gmail.com",
            token: "123456",
        });
    expect(resetRepository.findResetToken).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(401);
    expect(response.text).toMatch("Token expired");
});

test('confirming with no token specified returns token not defined response', async () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() - (1 * 60 * 60 * 1000));
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            email: "test@gmail.com",
        });
    expect(resetRepository.findResetToken).toHaveBeenCalledTimes(0);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch("Token not defined");
});

test('confirming token not sent to email returns no token sent response', async () => {
    userRepository.findByEmail.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });
    resetRepository.findResetToken.mockResolvedValue({
        rows: [],
    })
    const response = await request(app)
        .post("/signin/forgot/confirm")
        .send({
            email: "test@gmail.com",
            token: "123456",
        });
    expect(resetRepository.findResetToken).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(404);
    expect(response.text).toMatch("No token sent to test@gmail.com");
});
