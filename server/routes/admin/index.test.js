const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/helpers");

const validation = require("../../modules/validation");
const adminService = require("../../modules/admin/");
const deletion = require("../../modules/deletion");

jest.mock("../../modules/admin/");
jest.mock("../../modules/validation");
jest.mock("../../modules/deletion");

let user; let individual; let signup;

beforeEach(() => {
    jest.clearAllMocks();
    process.env.NO_AUTH = 1;
    user = testHelpers.getUserExample1();
    individual = testHelpers.getIndividual();
    signup = testHelpers.getSignUp();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("fetching users endpoint works", async () => {
    validation.validateIndividual.mockReturnValue({errors: ""});
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

test("fetching signups endpoint works", async () => {
    adminService.getAllSignups.mockResolvedValue({
        message: "Signups fetched successfully",
        status: 200,
        data: {signups: [signup]},
    });

    const response = await request(app)
        .get("/admin/signups");

    expect(adminService.getAllSignups).toHaveBeenCalledTimes(1);
    expect(response.body.data.signups).toMatchObject([signup]);
    expect(response.statusCode).toBe(200);
});

test("deleting all user data endpoint works", async () => {
    validation.validateIndividual.mockReturnValue({errors: ""});
    deletion.deleteAllInformation.mockResolvedValue({
        message: "All User information deleted successfully",
        status: 200,
        data: {user: user},
    });

    const response = await request(app)
        .post("/admin/user/delete?deleteUserId=3");

    expect(deletion.deleteAllInformation).toHaveBeenCalledTimes(1);
    expect(response.body.data.user).toMatchObject(user);
    expect(response.body.message).toBe("All User information deleted successfully");
    expect(response.statusCode).toBe(200);
});

test("fetching individuals endpoint works", async () => {
    validation.validateIndividual.mockReturnValue({errors: ""});
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
    validation.validateIndividual.mockReturnValue({errors: ""});
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

test("toggling invalid individual is rejected as expected", async () => {
    validation.validateIndividual.mockReturnValue({errors: "invalid"});
    adminService.toggleIndividualBan.mockResolvedValue({
        message: "Individual banned successfully",
        status: 200,
        data: {individual: individual},
    });

    const response = await request(app)
        .post("/admin/toggleBan")
        .send({data: {individual}});

    expect(validation.validateIndividual).toHaveBeenCalledTimes(1);
    expect(adminService.toggleIndividualBan).toHaveBeenCalledTimes(0);
    expect(response.body.message).toBe("Input validation failed");
    expect(response.statusCode).toBe(400);
});

test("fetching users endpoint in case of a system error returns error message as expected", async () => {
    validation.validateIndividual.mockReturnValue({errors: ""});
    adminService.getAllUsers.mockImplementation(() => {
      throw new Error("Server error");
    });
    const response = await request(app)
        .get("/admin/users");

    expect(adminService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.statusCode).toBe(500);
});

test("deleting all user data endpoint in case of a system error returns error message as expected", async () => {
    validation.validateIndividual.mockReturnValue({errors: ""});
    deletion.deleteAllInformation.mockImplementation(() => {
      throw new Error("Server error");
    });

    const response = await request(app)
        .post("/admin/user/delete?deleteUserId=3");

    expect(deletion.deleteAllInformation).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.statusCode).toBe(500);
});

test("fetching individuals endpoint in case of a system error returns error message as expected", async () => {
    validation.validateIndividual.mockReturnValue({errors: ""});
    adminService.getAllIndividuals.mockImplementation(() => {
      throw new Error("Server error");
    });

    const response = await request(app)
        .get("/admin/individuals");

    expect(adminService.getAllIndividuals).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.statusCode).toBe(500);
});

test("toggling individual's ban endpoint in case of a system error returns error message as expected", async () => {
    validation.validateIndividual.mockReturnValue({errors: ""});
    adminService.toggleIndividualBan.mockImplementation(() => {
      throw new Error("Server error");
    });

    const response = await request(app)
        .post("/admin/toggleBan")
        .send({data: {individual}});

    expect(validation.validateIndividual).toHaveBeenCalledTimes(1);
    expect(adminService.toggleIndividualBan).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.statusCode).toBe(500);
});