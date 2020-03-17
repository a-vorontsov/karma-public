const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");

const validation = require("../../modules/validation");
const adminService = require("../../modules/admin/adminService");

jest.mock("../../modules/admin/adminService");
jest.mock("../../modules/validation");
validation.validateIndividual.mockReturnValue({errors: ""});

let user, individual;

beforeEach(() => {
    jest.clearAllMocks();
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

test("banning individuals endpoint works", async () => {
    adminService.banIndividual.mockResolvedValue({
        message: "Individual banned successfully",
        status: 200,
        data: {individual: individual},
    });

    const response = await request(app)
        .post("/admin/ban")
        .send({data: {individual}});

    expect(validation.validateIndividual).toHaveBeenCalledTimes(1);
    expect(adminService.banIndividual).toHaveBeenCalledTimes(1);
    expect(response.body.data.individual).toMatchObject(individual);
    expect(response.statusCode).toBe(200);
});
