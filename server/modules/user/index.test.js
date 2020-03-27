const user = require("./");
const regStatus = require("../../util/registration");
const geocoder = require("../geocoder");
const testHelpers = require("../../test/helpers");
const addressRepo = require("../../repositories/address");
const userRepo = require("../../repositories/user");
const authService = require("../authentication");

jest.mock("../../util/registration");
jest.mock("../geocoder");
jest.mock("../authentication");
jest.mock("../../repositories/address");
jest.mock("../../repositories/user");

let address;

beforeEach(() => {
    address = testHelpers.getAddress();
});

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

test("registering email where already registered fails as expected", async () => {
    regStatus.emailExists.mockResolvedValue(true);
    expect(user.registerEmail("email@email.com")).rejects.toEqual(new Error("Invalid operation: email already exists."));
});

test("registering user where email not registered fails as expected", async () => {
    regStatus.emailExists.mockResolvedValue(false);
    expect(user.registerUser("email@email.com", "Sten", "pass", null)).rejects.toEqual(new Error("Invalid operation: registration record not found."));
});

test("registering user where user record already exists fails as expected", async () => {
    regStatus.emailExists.mockResolvedValue(true);
    regStatus.userAccountExists.mockResolvedValue(true);
    expect(user.registerUser("email@email.com", "Sten", "pass", null)).rejects.toEqual(new Error("500:Internal Server Error.This may be an indicator of malfunctioning DB queries, logical programming errors, or corrupt data."));
});

test("registering address with geocoded location works", async () => {
    geocoder.geocode.mockResolvedValue({
        latitude: 1.1,
        longitude: -1.1,
    });
    addressRepo.insert.mockResolvedValue({
        rows: [
            {id: 69},
        ],
    });
    const result = await user.registerAddress({
        addressLine1: "abc",
        addressLine2: "abc",
        postCode: "abc",
        townCity: "abc",
        countryState: "abc",
    });
    expect(geocoder.geocode).toHaveBeenCalledTimes(1);
    expect(addressRepo.insert).toHaveBeenCalledTimes(1);
    expect(result).toBe(69);
});

test("checking password for non-existent user fails as expected", async () => {
    userRepo.findByEmail.mockResolvedValue({
        rows: [
            undefined,
        ],
    });
    expect(user.isCorrectPasswordByEmail("email@email.com", "abc")).rejects.toEqual(new Error("User by given email/id not found"));
});

test("signing in works", async () => {
    userRepo.findByEmail.mockResolvedValue({
        rows: [
            {
                id: 69,
                passwordHash: "bd25f93e765c380a414d1cb7887a9cfcf5394fbc36443810256df3ce39f7ab32",
                salt: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
            },
        ],
    });
    authService.logInUser.mockReturnValue("token");
    const result = await user.signIn("email@email.com", "password", null);
    expect(result.status).toBe(200);
    expect(result.data.authToken).toBe("token");
});

test("signing in with incorrect password fails as expected", async () => {
    userRepo.findByEmail.mockResolvedValue({
        rows: [
            {
                id: 69,
                passwordHash: "bd25f93e765c380a414d1cb7887a9cfcf5394fbc36443810256df3ce39f7ab32",
                salt: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
            },
        ],
    });
    authService.logInUser.mockReturnValue("token");
    const result = await user.signIn("email@email.com", "incorrectPass", null);
    expect(result.status).toBe(400);
    expect(result.message).toBe("Invalid password.");
});
