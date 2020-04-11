const testHelpers = require("../../test/helpers");
const adminService = require("./");

const userRepository = require("../../repositories/user");
const individualRepository = require("../../repositories/individual");
const signupRepository = require("../../repositories/event/signup");


jest.mock("../../repositories/user");
jest.mock("../../repositories/individual");
jest.mock("../../repositories/event/signup");

let user; let individual; let individual2; let signup;

beforeEach(() => {
    user = testHelpers.getUserExample1();
    individual = testHelpers.getIndividual();
    individual2 = testHelpers.getIndividual2();
    signup = testHelpers.getSignUp();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("getting all users works", async () => {
    userRepository.findAll.mockResolvedValue({
        rows: [user],
    });

    const getAllUsersResult = await adminService.getAllUsers();

    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    expect(getAllUsersResult.data.users).toMatchObject([user]);
    expect(getAllUsersResult.status).toBe(200);
});

test("getting all signups works", async () => {
    signupRepository.findAll.mockResolvedValue({
        rows: [signup],
    });

    const getAllSignupsResult = await adminService.getAllSignups();

    expect(signupRepository.findAll).toHaveBeenCalledTimes(1);
    expect(getAllSignupsResult.data.signups).toMatchObject([signup]);
    expect(getAllSignupsResult.status).toBe(200);
});


test("getting all individuals users works", async () => {
    individual.id = 1;
    individual2.id = 2;
    individualRepository.findAll.mockResolvedValue({
        rows: [individual, individual2],
    });

    const getAllIndividualsResult = await adminService.getAllIndividuals();

    expect(individualRepository.findAll).toHaveBeenCalledTimes(1);
    expect(getAllIndividualsResult.data.individuals).toMatchObject([individual, individual2]);
    expect(getAllIndividualsResult.status).toBe(200);
});

test("toggling ban of an individual works", async () => {
    individualRepository.update.mockResolvedValue({
        rows: [{...individual, banned: true}],
    });

    individual.banned = false;
    const banIndividualResult = await adminService.toggleIndividualBan(individual);

    expect(individualRepository.update).toHaveBeenCalledTimes(1);
    expect(individualRepository.update).toHaveBeenCalledWith({...individual, banned: true});
    expect(banIndividualResult.data.individual).toMatchObject({...individual, banned: true});
    expect(banIndividualResult.status).toBe(200);
});
