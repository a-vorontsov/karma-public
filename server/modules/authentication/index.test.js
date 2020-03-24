const authAgent = require("./");
const testHelpers = require("../../test/testHelpers");
const userRepo = require("../../models/databaseRepositories/userRepository");
const regRepo = require("../../models/databaseRepositories/registrationRepository");
const indivRepo = require("../../models/databaseRepositories/individualRepository");
const addressRepo = require("../../models/databaseRepositories/addressRepository");
const authRepo = require("../../models/databaseRepositories/authenticationRepository");
const profileRepo = require("../../models/databaseRepositories/profileRepository");
const causeRepo = require("../../models/databaseRepositories/causeRepository");
const request = require("supertest");
const app = require("../../app");
const jose = require("../jose");
const npmjose = require('jose');
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWT, // JSON Web Token (JWT)
    errors, // errors utilized by jose
} = npmjose;
const joseConf = require("../../config").jose;
const adminService = require("../admin");
const userAgent = require("../user");

const user = testHelpers.getUserExample4();
const profile = testHelpers.getProfile();
const registration = testHelpers.getRegistrationExample4();

jest.mock("../../models/databaseRepositories/causeRepository");
jest.mock("../admin/");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});


test("log-in works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);
});

const cause = testHelpers.cause;

test("visiting an internal route with a valid token works", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: "toBeReceived",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);
    viewCausesRequest.authToken = authToken;

    const response = await request(app)
        .get("/causes")
        .set("authorization", authToken)
        .send(viewCausesRequest)
        .redirects(0);

    expect(causeRepo.findAll).toHaveBeenCalledTimes(1)
    expect(response.body.data).toMatchObject([{
        ...cause,
        id: 1,
    }]);
});

test("visiting an internal route with a missing token fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        // no authToken specified!!!
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .send(viewCausesRequest)
        .redirects(1);

    expect(response.body.message).toBe("No authToken specified in incoming request.");
    expect(response.statusCode).toBe(400);
});

test("visiting an internal route with a null token fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: null,
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .set("authorization", null)
        .send(viewCausesRequest)
        .redirects(1);

    expect(response.body.message).toBe("JWE malformed or invalid serialization");
    expect(response.statusCode).toBe(401);
});

test("visiting an internal route with a forged token validation tag fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: "eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiRUNESC1FUytBMTI4S1ciLCJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsIngiOiJ3VllyaDROZFd0ajNNb1BGcTZTV2JqZkF4cTRDbDczRl9jcmJMVzliNlZzIiwieSI6InJTMVM2c1JyMVg3S1h3S3hRTmZSaGZPSkxabzJJWVYtbjU0N2ZjR2xXSGcifX0.dg5t2uYI0k1YDNERmQvx_UK4yg83hO8g.kHrItPtwD1Pt4Zy8.ritBe511rVJ7StVV8ee0oD4RiWK95xGJEBGqJ3xQgu824WBQiYMpXZ_lTgmrhJGqfhjNZDnSO8jEhWDe3uAq1UUEyiwZy0JD9H7bRsVAI9cPbEmI2miqG40mwKHDIfLVjBsLIcNKpp9iUcTaQcAQ7ea_lS-CSChIjqt_PMUz5FQKX5so3sFKotT2toNGWiUKBBaiaZQhEZQa_Sm3889yCIY05vFv1oHgolG1jGE44GghAaRcgkRrQJOvbxNWwHoFx5NwFPqVWugcE5luZo_d7TPnPSgHL-xfLgEVO8RTV4nk1myYvlehGwgoN3qbwkxN27k2_DpCMrFSFSQpAoRxH7r8V90AFLZ_mgwpwpazA2z_QITDoOjFrks_TftX0_faYVBmVqGVn-tDG9xWByhOfOnq5Y8-oY6-inKicn1b.forged",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .set("authorization", viewCausesRequest.authToken)
        .send(viewCausesRequest)
        .redirects(1);

    expect(response.body.message).toBe("invalid tag");
    expect(response.statusCode).toBe(401);
});

test("visiting an internal route with modified pub params in the protected token header fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: "eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiRUNESC1FUytBMTI4S1ciLCJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsIngiOiJJbl9maDlPVXZUTEpjRHdnbURsSDlnN1dSU0NDaEJBQkYzV2hmZ01kdmNJIiwieSI6IjJudjc4TS1XalElRGU1ZzNKQUVUaWRrZUR2azRKVThSamVfOVQ1VzY3SzgifX0.HLPGRBkcQY5opHuNzNau8-1Ue1CmhkRS.8vEe-jwUIWgal2v6.I26p4DqHCW2_WARnTypWMhq__QjVm0bRME7VyVl6vCErjl9ppNj4FhNufWRkcJ-H_oZ8TpyRxIhkh06gqg_5OE_QD7spCk0360htu0hpa6-H4uBn4QWJRnAGsMzEf3Oq3KniAkQqV0pYm2ViN_q0NXyocAZMElU4uVIYq3nX449cgrlhHoyo2t7GIvc4mtZbkg-kIQBxPRtxvyiOcBdBOjS8H2BXo5B10k3jPmYiyrFfRY5-ss1uamelbOySr2VJ41fngj95PUyVZIUlq8d5YqudfnSuiQgXM8GacPMoDJOcRYJpoSot5HDDoJxA94BkdCbd6iGuXCcP1_Mfg1mkJNko12258arN_jS2O2KCnMPvh6dqhDDXWpUJnax19UMXYLrth5UQYNdNoEUizBZ68MuaAOLkQugX3BehOWfO.7ffqdIrDvhsibmKV3bM3IQ",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .set("authorization", viewCausesRequest.authToken)
        .send(viewCausesRequest)
        .redirects(1);

    expect(response.body.message).toBe("decryption operation failed");
    expect(response.statusCode).toBe(401);
});

test("visiting an internal route with a modified algo in the protected token header fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: "eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiRUNESC1FUyIsImVwayI6eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwieCI6Ik5WY1NsT2RSX1dlYXNQclhhZVFlSi1HR1hLcjlqZ3N2X1M1Q0hTa0pfNGciLCJ5IjoiM3Q5djhzdXJCaDk5VXNPemtDcjFRUE1lSFFYLWFGTUhObFFjSENEYk43ZyJ9fQ==.HLPGRBkcQY5opHuNzNau8-1Ue1CmhkRS.8vEe-jwUIWgal2v6.I26p4DqHCW2_WARnTypWMhq__QjVm0bRME7VyVl6vCErjl9ppNj4FhNufWRkcJ-H_oZ8TpyRxIhkh06gqg_5OE_QD7spCk0360htu0hpa6-H4uBn4QWJRnAGsMzEf3Oq3KniAkQqV0pYm2ViN_q0NXyocAZMElU4uVIYq3nX449cgrlhHoyo2t7GIvc4mtZbkg-kIQBxPRtxvyiOcBdBOjS8H2BXo5B10k3jPmYiyrFfRY5-ss1uamelbOySr2VJ41fngj95PUyVZIUlq8d5YqudfnSuiQgXM8GacPMoDJOcRYJpoSot5HDDoJxA94BkdCbd6iGuXCcP1_Mfg1mkJNko12258arN_jS2O2KCnMPvh6dqhDDXWpUJnax19UMXYLrth5UQYNdNoEUizBZ68MuaAOLkQugX3BehOWfO.7ffqdIrDvhsibmKV3bM3IQ",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);
    const response = await request(app)
        .get("/causes")
        .set("authorization", viewCausesRequest.authToken)
        .send(viewCausesRequest)
        .redirects(1);

    expect(response.body.message).toBe("decryption operation failed");
    expect(response.statusCode).toBe(401);
});

test("visiting an internal route with a forged algo in the protected token header fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: "eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiU0hBLTI1NiIsImVwayI6eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwieCI6Ik5WY1NsT2RSX1dlYXNQclhhZVFlSi1HR1hLcjlqZ3N2X1M1Q0hTa0pfNGciLCJ5IjoiM3Q5djhzdXJCaDk5VXNPemtDcjFRUE1lSFFYLWFGTUhObFFjSENEYk43ZyJ9fQ.HLPGRBkcQY5opHuNzNau8-1Ue1CmhkRS.8vEe-jwUIWgal2v6.I26p4DqHCW2_WARnTypWMhq__QjVm0bRME7VyVl6vCErjl9ppNj4FhNufWRkcJ-H_oZ8TpyRxIhkh06gqg_5OE_QD7spCk0360htu0hpa6-H4uBn4QWJRnAGsMzEf3Oq3KniAkQqV0pYm2ViN_q0NXyocAZMElU4uVIYq3nX449cgrlhHoyo2t7GIvc4mtZbkg-kIQBxPRtxvyiOcBdBOjS8H2BXo5B10k3jPmYiyrFfRY5-ss1uamelbOySr2VJ41fngj95PUyVZIUlq8d5YqudfnSuiQgXM8GacPMoDJOcRYJpoSot5HDDoJxA94BkdCbd6iGuXCcP1_Mfg1mkJNko12258arN_jS2O2KCnMPvh6dqhDDXWpUJnax19UMXYLrth5UQYNdNoEUizBZ68MuaAOLkQugX3BehOWfO.7ffqdIrDvhsibmKV3bM3IQ",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);
    const response = await request(app)
        .get("/causes")
        .set("authorization", viewCausesRequest.authToken)
        .send(viewCausesRequest)
        .redirects(1);

    expect(response.body.message).toBe("unsupported key management (decryption) alg: SHA-256");
    expect(response.statusCode).toBe(401);
});

test("visiting an internal route with a forged CEK fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: "eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiRUNESC1FUytBMTI4S1ciLCJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsIngiOiJ2YXVUaUlMaW1rUTJzQVhRWjJlcmdIRzNqN3F0QWdSOWFLRjk3cjQwTnZBIiwieSI6IllIWFhVTXk5MThBQnNiMXJ2Y21ZNktfUGY4bTZZRXpHXzJqUGt0d1ROTXcifX0.FORGED_CEK.Q3s_YBUGuyFoxto4._xdSUemzING8DsXhvIO5qXFN0MIf7pqSCiX8yMfAyKCg1vPf607nc3ppHhXZ6BpWcyjZU2-aQXVz5V4fbIb9BLQKh1BOGawCbhLpsud8yp-YgvxziF06N6_s6wBHwuOtMlJWAbBYpwbLjZaw4qTQpmYtMwui066HI1ImTCDiD299zQ7l0igiiDSxlgjWOcnmKeR91ZO-ZKXSoBnZ8bskCMTKRuzPg7Fu11xnKP8bIC4BEojAj-sbCn5Tgx0RVv5CbePnkM8z1Vv8g-h4tL_HsyRYs4s5BUoniAr0yZR9Xz7dFpG439RtxCglkc8bPhCgXqci4TLFDCwJvmEywhbPWHPlvAsuoKely7qo3qAV17GaiLoRlR09UxdiA16jAUoS6j_Rag3SRsvZ6A-EZnWcovG9E0UxnOqVvnAWPl5u.RNBJ5UlHDVb22M8ljN57tA",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .set("authorization", viewCausesRequest.authToken)
        .send(viewCausesRequest)
        .redirects(1);

    expect(response.body.message).toBe("decryption operation failed");
    expect(response.statusCode).toBe(401);
});

test("visiting an internal route with a forged initialisation vector fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: "eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiRUNESC1FUytBMTI4S1ciLCJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsIngiOiJiNnh6R1UzZHJnU2IzcGdIWngyM3BGNkVFLTJYMnJockc3dWVjTmlnMFVFIiwieSI6ImlRbWc0QU56YUxFZm9sYUN3a1lWRjI5Ri11eUk1WVphelBES2U0aklPeFkifX0.lh5Zo8eN-iY8WeOlqvONVZl9xPz2-WaX.MAVECTOR.gqt0_kLQuoDxv5_Xo6MPeDcOK5DeSTBV0kJ245xQE_RiI2yiKaTqr5LQbyP6EQNqnOyzURzllIQx7YK79PKyiWkRDsDwSPjH8noWM2ZZnslUH83-k7rPb9zq1PjDpw0TFUToogbI8Nxae_Ld9dgbIPWshVbyOcn1P9WuYTvsL2leMtVi77L9GJ5h8OWFgjnkZJDv-r8IL_N34OF5u0vPHUioxgrJXxSmiAuYMiNt2tqY6WTDg9MZTojFaETCvSDMISsiTQSibt1b5slKSvvmPDYGozx_puaLT9d29oDFsez5Nf4gs1Z7ewlp8vUdw39EUBDacq0TyrzLEECnCnjpwQIhTzFdXb1PtqpFSd2QV5v0H1NSxP-A7y60_OhW8k64dsrN9sKt4Vctz1YGqOz8s7RjbZuKRYUEIMM0XWDg.vXXInHDxr4O7eCLugLq5-A",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .set("authorization", viewCausesRequest.authToken)
        .send(viewCausesRequest)
        .redirects(1);

    expect(response.body.message).toBe("invalid iv");
    expect(response.statusCode).toBe(401);
});

test("visiting an internal route with tampered data fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: "eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiRUNESC1FUytBMTI4S1ciLCJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsIngiOiJiNnh6R1UzZHJnU2IzcGdIWngyM3BGNkVFLTJYMnJockc3dWVjTmlnMFVFIiwieSI6ImlRbWc0QU56YUxFZm9sYUN3a1lWRjI5Ri11eUk1WVphelBES2U0aklPeFkifX0.lh5Zo8eN-iY8WeOlqvONVZl9xPz2-WaX.MAVECTOR.gqt0_kLQuoDxv5_Xo6MPeDcOK5DeSTBV0kJ245xQE_RiI2yiKaTqr5LQbyP6EQNqnOyzURzllIQx7YK79PKyiWkRDsDwSPjH8noWM2ZZnslUH83-k7rPb9zq1PjDpw0TFUToogbI8Nxae_Ld9dgbIPWshVbyOcn1P9WuYTvsL2leMtVi77L9GJ5h8OWFgjnkZJDv-r8IL_N34OF5u0vPHUioxgrJXxSmiAuYMiNt2tqY6WTDg9MZTojFaETCvSDMISsiTQSibt1b5slKSvvmPDYGozx_puaLT9d29oDFsez5Nf4gs1Z7ewlp8vUdw39EUBDacq0TyrzLEECnCnjpwQIhTzFdXb1PtqpFSd2QV5v0H1NSxP-A7y60_OhW8k64dsrN9sKt4Vctz1YGqOz8s7RjbZuKRYUEIMM0XWDf.vXXInHDxr4O7eCLugLq5-A",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .set("authorization", viewCausesRequest.authToken)
        .send(viewCausesRequest)
        .redirects(1);

    expect(response.body.message).toBe("invalid iv");
    expect(response.statusCode).toBe(401);
});

test("visiting an internal route with a stolen token fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: "eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiRUNESC1FUytBMTI4S1ciLCJlcGsiOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsIngiOiItcUtGc0Q2U3ZGU0FtYzdVUnRILU9oSTU0M1VReExjcldRRDU0SDk4aXE0IiwieSI6Ik91Yjc0c0FtNFc4X01zdUZ3RElCZWkzbU9QZGJSRnB6SXFMVUxka2lCMGMifX0.z60Y-PiypVFGP4G6k1M5P8GdAprA15fD.2SI2E8h_xaJ6PIfz.g-NteraFRKKfaoX_PxKEhXcaFc-hnPLuIqvpaoki7b78NUS19GLuao4Sw3NqOj4sRX1qLchF17JVIGi6t7yS_VTInjOoVNXivDYyp-syGO52rzsUVsOqLpwpdBvLvJm05wY7MlcfBv4fvNTN_trkqp-E9Es4N4u1QsaHAH6cxArx1D3Kr5jfNz88cwFsCsv6r85Cjytf7mxQUR9x_TOmWPNcx7Ni7-EomMXk7xfHbYY5E0_SqrKANGEhzcuEDBCXMOCKC9TAryjRLWLS_q08wkjGqG0Yxb7AzXAnJLc96PQAOFTpIPZXwZlvLotx4R7wSnZXZn49MBHiZEx_w1KezY1TAL81NwM3CsLCEM-BWYp3ITvZgqxFHR2lKvkRVD9ytpeiKUrO9ZoTeEV4kW9GomP9VoLUMiKU1nYSq_v5.5I_mT25LYdNz5kDhv2LC1g",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);

    const response = await request(app)
        .get("/causes")
        .set("authorization", viewCausesRequest.authToken)
        .send(viewCausesRequest)
        .redirects(1);

    expect(response.body.message).toBe("decryption operation failed");
    expect(response.statusCode).toBe(401);
});

test("visiting a no-auth route un-authenticated with null token works", async () => {
    const signUpEmailReq = {
        // no userId specified!!!
        authToken: null,
        data: {
            email: "abc@gmail.com",
        },
    };

    const response = await request(app)
        .post("/signin/email")
        .set("authorization", signUpEmailReq.authToken)
        .send(signUpEmailReq)
        .redirects(0);

    expect(response.body.message).toBe("Email did not exist. Email successfully recorded, wait for user to input email verification code.");
    expect(response.statusCode).toBe(200);
});

test("visiting a no-auth route un-authenticated with invalid token works", async () => {
    const signUpEmailReq = {
        // no userId specified!!!
        authToken: "invalid",
        data: {
            email: "abc@gmail.com",
        },
    };

    const response = await request(app)
        .post("/signin/email")
        .set("authorization", signUpEmailReq.authToken)
        .send(signUpEmailReq)
        .redirects(0);

    expect(response.body.message).toBe("Email did not exist. Email successfully recorded, wait for user to input email verification code.");
    expect(response.statusCode).toBe(200);
});

test("visiting a no-auth route un-authenticated with missing token fails as expected", async () => {
    const signUpEmailReq = {
        // no userId specified!!!
        data: {
            email: "abc@gmail.com",
        },
    };

    const response = await request(app)
        .post("/signin/email")
        .send(signUpEmailReq)
        .redirects(1);

    expect(response.body.message).toBe("No authToken specified in incoming request.");
    expect(response.statusCode).toBe(400);
});

test("visiting a no-auth route already authenticated redirects as expected", async () => {
    const signUpEmailReq = {
        // no userId specified!!!
        authToken: null,
        data: {
            email: "anything, I'm already auth anyways",
        },
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);
    signUpEmailReq.authToken = authToken;

    const response = await request(app)
        .post("/signin/email")
        .set("authorization", signUpEmailReq.authToken)
        .send(signUpEmailReq)
        .redirects(1);

    expect(response.body.message).toBe("Request is already authenticated.");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.alreadyAuthenticated).toBe(true);
});

test("visiting an internal route with a blacklisted token fails as expected", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        authToken: "toBeReceived",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);
    viewCausesRequest.authToken = authToken;

    const response = await request(app)
        .get("/causes")
        .set("authorization", viewCausesRequest.authToken)
        .send(viewCausesRequest)
        .redirects(0);

    expect(causeRepo.findAll).toHaveBeenCalledTimes(1)
    expect(response.body.data).toMatchObject([{
        ...cause,
        id: 1,
    }]);

    await authAgent.logOut(authToken);

    const response2 = await request(app)
        .get("/causes")
        .set("authorization", viewCausesRequest.authToken)
        .send(viewCausesRequest)
        .redirects(1);

    expect(response2.body.message).toBe("JWT blacklisted");
    expect(response2.statusCode).toBe(401);
});

test("visiting a no-auth route with auth-checks disabled works", async () => {
    const signUpEmailReq = {
        // no userId specified!!!
        authToken: null,
        data: {
            email: "anything, I'm already auth anyways",
        },
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);
    signUpEmailReq.authToken = authToken;

    process.env.NO_AUTH = 1;

    const response = await request(app)
        .post("/signin/email")
        .set("authorization", signUpEmailReq.authToken)
        .send(signUpEmailReq)
        .redirects(1);

    expect(response.body.message).toBe("Email did not exist. Email successfully recorded, wait for user to input email verification code.");
    expect(response.statusCode).toBe(200);

    process.env.NO_AUTH = 0;
});

test("visiting an internal route with auth-checks disabled works", async () => {
    causeRepo.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const viewCausesRequest = {
        // no userId specified!!!
        // no auth token specified
    };

    process.env.NO_AUTH = 1;

    const response = await request(app)
        .get("/causes")
        .set("authorization", null)
        .send(viewCausesRequest)
        .redirects(0);

    expect(causeRepo.findAll).toHaveBeenCalledTimes(1)
    expect(response.body.data).toMatchObject([{
        ...cause,
        id: 1,
    }]);

    process.env.NO_AUTH = 0;
});

test("visiting an admin route with a valid token works", async () => {
    adminService.getAllUsers.mockResolvedValue({
        message: "Users fetched successfully",
        status: 200,
        data: { users: [user] },
    });
    const adminRequest = {
        // no userId specified!!!
        authToken: "toBeReceived",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInAdmin(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken, "/admin")).toStrictEqual(userId);
    adminRequest.authToken = authToken;

    const response = await request(app)
        .get("/admin/users")
        .set("authorization", adminRequest.authToken)
        .send(adminRequest)
        .redirects(0);

    expect(adminService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(response.body.data.users).toMatchObject([user]);
});

test("visiting an admin route with a user token fails as expected", async () => {
    adminService.getAllUsers.mockResolvedValue({
        message: "Users fetched successfully",
        status: 200,
        data: { users: [user] },
    });
    const adminRequest = {
        // no userId specified!!!
        authToken: "toBeReceived",
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);
    adminRequest.authToken = authToken;

    const response = await request(app)
        .get("/admin/users")
        .set("authorization", adminRequest.authToken)
        .send(adminRequest)
        .redirects(1);

    expect(response.body.message).toBe("unexpected \"aud\" claim value");
    expect(response.statusCode).toBe(401);
});

test("visiting the reset route with a regular user token fails as expected", async () => {
    const resetRequest = {
        // no userId specified!!!
        authToken: "toBeReceived",
        data: {
            password: "newpass69",
        },
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.logInUser(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken)).toStrictEqual(userId);
    resetRequest.authToken = authToken;

    const response = await request(app)
        .post("/reset")
        .set("authorization", resetRequest.authToken)
        .send(resetRequest)
        .redirects(1);

    expect(response.body.message).toBe("unexpected \"aud\" claim value");
    expect(response.statusCode).toBe(401);
});

test("visiting the reset route with a password reset token works", async () => {
    const resetRequest = {
        // no userId specified!!!
        authToken: "toBeReceived",
        data: {
            password: "newPass69!.",
        },
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = authAgent.grantResetAccess(userId, jose.getEncPubAsPEM());
    expect(jose.decryptVerifyAndGetUserId(authToken, "/reset")).toStrictEqual(userId);
    resetRequest.authToken = authToken;

    const response = await request(app)
        .post("/reset")
        .set("authorization", resetRequest.authToken)
        .send(resetRequest)
        .redirects(0);

    expect(response.body.message).toBe("Password successfully updated. Go to sign-in screen.");
    expect(response.statusCode).toBe(200);
    expect(await userAgent.isCorrectPasswordById(userId, resetRequest.data.password)).toBe(true);
});

test("visiting the reset route without a token fails as expected", async () => {
    const resetRequest = {
        // no userId specified!!!
        authToken: "none.none.none",
        data: {
            password: "newPass69!.",
        },
    };

    const response = await request(app)
        .post("/reset")
        .set("authorization", resetRequest.authToken)
        .send(resetRequest)
        .redirects(1);

    expect(response.body.message).toBe("JWE malformed or invalid serialization");
    expect(response.statusCode).toBe(401);
});
