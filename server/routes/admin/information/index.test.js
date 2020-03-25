const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const validation = require("../../../modules/validation");
const informationService = require("../../../modules/information");

jest.mock("../../../modules/information");
jest.mock("../../../modules/validation");
validation.validateInformation.mockReturnValue({ errors: "" });

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
    informationService.getInformationData.mockResolvedValue({
        status: 200,
        message: "Information entry fetched successfully",
        data: { information: {} },
    });
    informationService.changeInformation.mockResolvedValue({
        status: 200,
        message: "New information entry created",
        data: {
            information: {
                information
            }
        },
    });

    const response = await request(app)
        .post("/admin/information")
        .send(information);

    expect(validation.validateInformation).toHaveBeenCalledTimes(1);
    expect(informationService.changeInformation).toHaveBeenCalledTimes(1);
    expect(response.body.data.information).toMatchObject({
        information
    });
    expect(response.statusCode).toBe(200);
});

test("information update works", async () => {
    informationService.getInformationData.mockResolvedValue({
        status: 200,
        message: "Information entry fetched successfully",
        data: {
            information: {
                information
            }
        },
    });
    informationService.changeInformation.mockResolvedValue({
        status: 200,
        message: "Information entry updated successfully",
        data: {
            information: {
                information
            }
        },
    });

    const response = await request(app)
        .post("/admin/information")
        .send(information);

    expect(validation.validateInformation).toHaveBeenCalledTimes(1);
    expect(informationService.changeInformation).toHaveBeenCalledTimes(1);
    expect(response.body.data.information).toMatchObject({
        information
    });
    expect(response.statusCode).toBe(200);
});
