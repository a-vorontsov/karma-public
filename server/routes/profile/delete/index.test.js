const deletionRoute = require("./");
const deletionService = require("../../../modules/deletion");
const request = require("supertest");
const app = require("../../../app");

jest.mock("../../../modules/deletion");

beforeEach(() => {
    process.env.NO_AUTH = 1;
});

afterEach(() => {
    jest.clearAllMocks();
    process.env.NO_AUTH = 0;
});

test("deleting own user account endpoint works", async () => {
    deletionService.deleteAllInformation.mockResolvedValue({
        status: 200,
        message: "All User information deleted successfully",
        data: {user: {id: 1}},
    })
    const response = await request(app)
        .post("/profile/delete?userId=1")
        .send();

    expect(deletionService.deleteAllInformation).toHaveBeenCalledTimes(1);
    expect(deletionService.deleteAllInformation).toHaveBeenCalledWith("1");
    expect(response.body.message).toBe("All User information deleted successfully");
    expect(response.status).toBe(200);
});

test("deleting own user account endpoint in case of a database error returns error message as expected", async () => {
    deletionService.deleteAllInformation.mockImplementation(() => {
        throw new Error("DB error");
    });
    const response = await request(app)
        .post("/profile/delete?userId=1")
        .send();

    expect(deletionService.deleteAllInformation).toHaveBeenCalledTimes(1);
    expect(deletionService.deleteAllInformation).toHaveBeenCalledWith("1");
    expect(response.body.message).toBe("DB error");
    expect(response.status).toBe(500);
});

