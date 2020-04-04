const deletionRoute = require("./");
const deletionService = require("../../../modules/deletion");
const request = require("supertest");
const app = require("../../../app");
const authService = require("../../../modules/authentication");

jest.mock("../../../modules/deletion");

beforeEach(() => {
});

afterEach(() => {
    jest.clearAllMocks();
});

test("deleting own user account with valid authToken works", async () => {
    deletionService.deleteAllInformation.mockResolvedValue({
        status: 200,
        message: "All User information deleted successfully",
        data: {user: {id: 1}},
    })
    const authToken = authService.logInUser(1);

    const response = await request(app)
        .post("/profile/delete")
        .set("authorization", authToken)
        .send();

    expect(deletionService.deleteAllInformation).toHaveBeenCalledTimes(1);
    expect(deletionService.deleteAllInformation).toHaveBeenCalledWith(1);
    expect(response.body.message).toBe("All User information deleted successfully");
    expect(response.status).toBe(200);
});