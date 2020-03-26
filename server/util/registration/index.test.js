const regStatus = require("./");
const regRepo = require("../../repositories/registration");

jest.mock("../../repositories/registration");

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

test("checking verification status of a non-existent email fails as expected", async () => {
    regRepo.findByEmail.mockResolvedValue({rows: [
        undefined,
    ]});
    expect(regStatus.isEmailVerified("email@email.com")).rejects.toEqual(new Error("Registration record with given email does not exist"));
});

test("checking full registration status of a non-existent user email fails as expected", async () => {
    regRepo.findByEmail.mockResolvedValue({
        rows: [
            undefined,
        ]
    });
    expect(regStatus.isFullyRegisteredByEmail("email@email.com")).rejects.toEqual(new Error("Registration record with given email does not exist"));
});