const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const validation = require("../../../modules/validation");
const informationService = require("../../../modules/information");

jest.mock("../../../modules/information");
jest.mock("../../../modules/validation");

let information;

beforeEach(() => {
    jest.clearAllMocks();
    process.env.NO_AUTH = 1;
    information = testHelpers.getInformation();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("information creation endpoint works", async () => {
    validation.validateInformation.mockReturnValue({errors: ""});
    informationService.getInformationData.mockResolvedValue({
        status: 200,
        message: "Information entry fetched successfully",
        data: {information: {}},
    });
    informationService.changeInformation.mockResolvedValue({
        status: 200,
        message: "New information entry created",
        data: {
            information: {
                information,
            },
        },
    });

    const response = await request(app)
        .post("/admin/information")
        .send(information);

    expect(validation.validateInformation).toHaveBeenCalledTimes(1);
    expect(informationService.changeInformation).toHaveBeenCalledTimes(1);
    expect(response.body.data.information).toMatchObject({
        information,
    });
    expect(response.statusCode).toBe(200);
});

test("information creation with invalid information is rejected as expected", async () => {
    validation.validateInformation.mockReturnValue({errors: "invalid"});
    informationService.getInformationData.mockResolvedValue({
        status: 200,
        message: "Information entry fetched successfully",
        data: {information: {}},
    });
    informationService.changeInformation.mockResolvedValue({
        status: 200,
        message: "New information entry created",
        data: {
            information: {
                information,
            },
        },
    });

    const response = await request(app)
        .post("/admin/information")
        .send(information);

    expect(validation.validateInformation).toHaveBeenCalledTimes(1);
    expect(informationService.changeInformation).toHaveBeenCalledTimes(0);
    expect(response.body.message).toBe("Input validation failed");
    expect(response.statusCode).toBe(400);
});

test("information update works", async () => {
    validation.validateInformation.mockReturnValue({errors: ""});
    informationService.getInformationData.mockResolvedValue({
        status: 200,
        message: "Information entry fetched successfully",
        data: {
            information: {
                information,
            },
        },
    });
    informationService.changeInformation.mockResolvedValue({
        status: 200,
        message: "Information entry updated successfully",
        data: {
            information: {
                information,
            },
        },
    });

    const response = await request(app)
        .post("/admin/information")
        .send(information);

    expect(validation.validateInformation).toHaveBeenCalledTimes(1);
    expect(informationService.changeInformation).toHaveBeenCalledTimes(1);
    expect(response.body.data.information).toMatchObject({
        information,
    });
    expect(response.statusCode).toBe(200);
});

test("information updating in case of a system error returns error message as expected", async () => {
    validation.validateInformation.mockReturnValue({errors: ""});
    informationService.getInformationData.mockResolvedValue({
        status: 200,
        message: "Information entry fetched successfully",
        data: {
            information: {
                information,
            },
        },
    });
    informationService.changeInformation.mockImplementation(() => {
      throw new Error("Server error");
    });

    const response = await request(app)
        .post("/admin/information")
        .send(information);

    expect(validation.validateInformation).toHaveBeenCalledTimes(1);
    expect(informationService.changeInformation).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.statusCode).toBe(500);
});
