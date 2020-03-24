const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");

const validation = require("../../modules/validation");
const adminService = require("../../modules/admin/");
const deletion = require("../../modules/deletion");

jest.mock("../../modules/admin/");
jest.mock("../../modules/validation");
jest.mock("../../modules/deletion");
validation.validateIndividual.mockReturnValue({errors: ""});

let user, individual;

beforeEach(() => {
    jest.clearAllMocks();
    process.env.NO_AUTH = 1;
    user = testHelpers.getUserExample1();
    individual = testHelpers.getIndividual();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("fetching users endpoint works", async () => {
    adminService.getAllUsers.mockResolvedValue({
        message: "Users fetched successfully",
        status: 200,
        data: {users: [user]},
    });

    const response = await request(app)
        .get("/admin/users");

    expect(adminService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(response.body.data.users).toMatchObject([user]);
    expect(response.statusCode).toBe(200);
});

test("deleting all user data endpoint works", async () => {
    deletion.deleteAllInformation.mockResolvedValue({
        message: "All User information deleted successfully",
        status: 200,
        data: {user: user},
    });

    const response = await request(app)
        .post("/admin/user/delete?userId=3");

    expect(deletion.deleteAllInformation).toHaveBeenCalledTimes(1);
    expect(response.body.data.user).toMatchObject(user);
    expect(response.body.message).toBe("All User information deleted successfully");
    expect(response.statusCode).toBe(200);
});

test("fetching individuals endpoint works", async () => {
    adminService.getAllIndividuals.mockResolvedValue({
        message: "Individuals fetched successfully",
        status: 200,
        data: {individuals: [individual]},
    });

    const response = await request(app)
        .get("/admin/individuals");

    expect(adminService.getAllIndividuals).toHaveBeenCalledTimes(1);
    expect(response.body.data.individuals).toMatchObject([individual]);
    expect(response.statusCode).toBe(200);
});

test("toggling individual's ban endpoint works", async () => {
    adminService.toggleIndividualBan.mockResolvedValue({
        message: "Individual banned successfully",
        status: 200,
        data: {individual: individual},
    });

    const response = await request(app)
        .post("/admin/toggleBan")
        .send({data: {individual}});

    expect(validation.validateIndividual).toHaveBeenCalledTimes(1);
    expect(adminService.toggleIndividualBan).toHaveBeenCalledTimes(1);
    expect(response.body.data.individual).toMatchObject(individual);
    expect(response.statusCode).toBe(200);
});
