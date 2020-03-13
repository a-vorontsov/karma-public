const request = require('supertest');
const app = require('../../app');
const testHelpers = require("../../test/testHelpers");

const mailSender = require("../../modules/mailSender");

jest.mock("../../modules/mailSender");


beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const bugReport = testHelpers.getBugReport();


test('bug report sending works', async () => {

    mailSender.sendBugReport.mockResolvedValue(
        result = {
            status: 200,
            info: "info",
            message: `Email sent to ${bugReport.data.email}`,
        },
    );
    const response = await request(app)
        .post("/bugreport")
        .send(bugReport);

    expect(mailSender.sendBugReport).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Email sent to " + bugReport.data.email);
    expect(response.status).toBe(200);
});

test('bug report endpoint gives correct response if mail-sending fails', async () => {

    mailSender.sendBugReport.mockResolvedValue(
        result = {
            status: 500,
            info: "info",
            message: `Email sending failed to ${bugReport.data.email}`,
        },
    );
    const response = await request(app)
        .post("/bugreport")
        .send(bugReport);

    expect(mailSender.sendBugReport).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Email sending failed to " + bugReport.data.email);
    expect(response.status).toBe(500);
});