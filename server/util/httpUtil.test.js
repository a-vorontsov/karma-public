const httpUtil = require("./httpUtil");

afterEach(() => jest.clearAllMocks());

test("validation errors sent correctly", async () => {
    const send = jest.fn();
    const res = {status: jest.fn(() => ({send: send}))};
    const validationResult = {errors: ["err1", "err2", "err3"]};
    httpUtil.sendValidationErrors(validationResult, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith({
        message: "Input validation failed",
        errors: ["err1", "err2", "err3"],
    });
});

test("results sent correctly", async () => {
    const send = jest.fn();
    const res = {status: jest.fn(() => ({send: send}))};
    const result = {
        status: 200,
        data: {name: "Sten"},
    };
    httpUtil.sendResult(result, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith({
        data: {name: "Sten"},
    });
});

test("generic errors sent correctly", async () => {
    const send = jest.fn();
    const res = {status: jest.fn(() => ({send: send}))};
    const error = new Error("Broken");
    httpUtil.sendGenericError(error, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith({
        message: "Broken",
    });
});

