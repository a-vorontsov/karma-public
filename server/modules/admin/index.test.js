const testHelpers = require("../../test/testHelpers");
const adminService = require("./");

const userRepository = require("../../models/databaseRepositories/userRepository");
const individualRepository = require("../../models/databaseRepositories/individualRepository");


jest.mock("../../models/databaseRepositories/userRepository");
jest.mock("../../models/databaseRepositories/individualRepository");

let user, individual;

beforeEach(() => {
    user = testHelpers.getUserExample1();
    individual = testHelpers.getIndividual();
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

test("getting all individuals users works", async () => {
    individualRepository.findAll.mockResolvedValue({
        rows: [individual],
    });

    const getAllIndividualsResult = await adminService.getAllIndividuals();

    expect(individualRepository.findAll).toHaveBeenCalledTimes(1);
    expect(getAllIndividualsResult.data.individuals).toMatchObject([individual]);
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
