const jose = require('jose');
const Base64 = require('js-base64').Base64;
const util = require("../../util");
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWT, // JSON Web Token (JWT)
    errors, // errors utilized by jose
} = jose;
const authRepo = require("../../models/databaseRepositories/authenticationRepository");
const userRepo = require("../../models/databaseRepositories/userRepository");
const regRepo = require("../../models/databaseRepositories/registrationRepository");
const testHelpers = require("../../test/helpers");

const joseOnServer = require("./");


beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("JWT signing with default and custom exp work", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);
    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));

    const jwtWithCustomExp = joseOnServer.sign(payload, "15 m");
    const jwtWithCustomExpSplit = jwtWithCustomExp.split(".");
    const jwtWithCustomExpHeader = JSON.parse(Base64.decode(jwtWithCustomExpSplit[0]));
    const jwtWithCustomExpPayload = JSON.parse(Base64.decode(jwtWithCustomExpSplit[1]));

    expect(jwtHeader).toStrictEqual(jwtWithCustomExpHeader);
    expect(jwtPayload.sub).toStrictEqual(jwtWithCustomExpPayload.sub);
    expect(jwtPayload.aud).toStrictEqual(jwtWithCustomExpPayload.aud);
    expect(jwtPayload.iss).toStrictEqual(jwtWithCustomExpPayload.iss);
    expect(jwtPayload.exp).not.toStrictEqual(jwtWithCustomExpPayload.exp);
});

test("JWT server-side verification works", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const serverVerificationResult = joseOnServer.verify(jwt);

    expect(serverVerificationResult.sub).toStrictEqual(payload.sub);
    expect(serverVerificationResult.aud).toStrictEqual(payload.aud);
});

test("JWT server-side verification with custom audience works", async () => {
    const payload = {
        sub: "1",
        aud: "/admin",
    };

    const jwt = joseOnServer.sign(payload);

    const serverVerificationResult = joseOnServer.verify(jwt, "/admin");

    expect(serverVerificationResult.sub).toStrictEqual(payload.sub);
    expect(serverVerificationResult.aud).toStrictEqual(payload.aud);
});

test("JWT server-side verification and userId deriving work", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const serverVerificationResult = joseOnServer.verify(jwt);
    const userId = joseOnServer.getUserIdFromPayload(serverVerificationResult);

    expect(serverVerificationResult.sub).toStrictEqual(payload.sub);
    expect(serverVerificationResult.aud).toStrictEqual(payload.aud);
    expect(userId).toStrictEqual(Number.parseInt(payload.sub));
});

test("JWT (combined) server-side verification and userId deriving work", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const serverVerificationResult = joseOnServer.verify(jwt);
    const userId = joseOnServer.getUserIdFromPayload(serverVerificationResult);

    const userId2 = joseOnServer.verifyAndGetUserId(jwt);

    expect(userId).toStrictEqual(Number.parseInt(payload.sub));
    expect(userId2).toStrictEqual(Number.parseInt(payload.sub));
    expect(userId2).toStrictEqual(userId);
});

test("JWT that's expired is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload, "0s");

    await util.sleep(10);

    expect(() => {
        joseOnServer.verify(jwt);
    }).toThrow(new errors.JWTExpired("\"exp\" claim timestamp check failed"));

    expect(() => {
        joseOnServer.verify(jwt);
    }).toThrow(errors.JWTClaimInvalid);

    expect(() => {
        joseOnServer.verify(jwt);
    }).toThrow(errors.JWTExpired);
});

test("JWT with non-matching audience is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    expect(() => {
        joseOnServer.verify(jwt, "/admin");
    }).toThrow(new errors.JWTClaimInvalid("unexpected \"aud\" claim value"));

    expect(() => {
        joseOnServer.verify(jwt, "/admin");
    }).toThrow(errors.JWTClaimInvalid);
});

test("JWT with invalid type is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtHeader.typ = 'invalidType';

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with invalid key-id is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtHeader.kid = jwtHeader.kid.substring(jwtHeader.length - 5) + "abcde";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with invalid algorithm is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtHeader.alg = "ES384";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWKKeySupport("the key does not support " + jwtHeader.alg + " verify algorithm"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWKKeySupport);
});

test("JWT with modified expiry is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.exp = 1589909685;

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified issue date is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.iat = 1584316685;

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified issuer is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.iss = "https://karmaaaaaapp.com";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified audience is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.aud = "/admin";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified audience and forged claim is also rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.aud = "/admin";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt, "/admin");
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt, "/admin");
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified subject is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.sub = "2";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with modified subject and forged claim is also rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.sub = "2";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        jwtSignature;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT with forged signature is rejected as expected", async () => {
    const payload = {
        sub: "1",
        aud: "/user",
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    const malformedSig = jwtSignature.substring(jwtSignature - 5) + "abcde";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "." +
        Base64.encodeURI(JSON.stringify(jwtPayload)) + "." +
        malformedSig;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWT blacklisting works", async () => {
    await regRepo.insert(testHelpers.getRegistrationExample5());
    const userRes = await userRepo.insert(testHelpers.getUserExample4());
    const userId = userRes.rows[0].id;

    const payload = {
        sub: "1",
        aud: "/user",
    };

    payload.sub = userId.toString();

    const jwt = joseOnServer.sign(payload);
    const jwtSig = joseOnServer.getSignatureFromJWT(jwt);

    expect(joseOnServer.isBlacklisted(jwtSig)).toBe(false);

    await joseOnServer.blacklistJWT(jwt);

    const authResult = await authRepo.findLatestByUserID(userId);
    const authRecord = authResult.rows[0];

    expect(authRecord.token).toStrictEqual(jwtSig);

    expect(joseOnServer.isBlacklisted(jwtSig)).toBe(true);
});

test("JWT blacklist fetching works", async () => {
    await regRepo.insert(testHelpers.getRegistrationExample5());
    const userRes = await userRepo.insert(testHelpers.getUserExample4());
    const userId = userRes.rows[0].id;

    const payload = {
        sub: "1",
        aud: "/user",
    };

    payload.sub = userId.toString();

    const jwt = joseOnServer.sign(payload);
    const jwtSig = joseOnServer.getSignatureFromJWT(jwt);

    await joseOnServer.fetchBlacklist();

    expect(joseOnServer.isBlacklisted(jwtSig)).toBe(false);

    await authRepo.insert({
        token: jwtSig,
        creationDate: "2021-06-22T18:10:25.000Z", // TODO:
        userId: userId,
    });

    await joseOnServer.fetchBlacklist();

    expect(joseOnServer.isBlacklisted(jwtSig)).toBe(true);
});

test("JWT with blacklisted signature is rejected as expected", async () => {
    await regRepo.insert(testHelpers.getRegistrationExample5());
    const userRes = await userRepo.insert(testHelpers.getUserExample4());
    const userId = userRes.rows[0].id;

    const payload = {
        sub: "1",
        aud: "/user",
    };

    payload.sub = userId.toString();

    const jwt = joseOnServer.sign(payload);
    const jwtSig = joseOnServer.getSignatureFromJWT(jwt);

    // verification passes before blacklisting
    expect(joseOnServer.isBlacklisted(jwtSig)).toBe(false);
    expect(joseOnServer.verifyAndGetUserId(jwt)).toStrictEqual(Number.parseInt(payload.sub));

    await joseOnServer.blacklistJWT(jwt);

    // verification fails after blacklisting
    expect(joseOnServer.isBlacklisted(jwtSig)).toBe(true);

    expect(() => {
        joseOnServer.verify(jwt);
    }).toThrow(new errors.JWSVerificationFailed("JWT blacklisted"));

    expect(() => {
        joseOnServer.verify(jwt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWK key generation with public server config works", async () => {
    // on client:
    // 1) get public jose config from server
    const publicServerConfig = joseOnServer.getPublicConfig();
    // 2) generate client-side enc key
    const clientEncKey = JWK.generateSync(publicServerConfig.kty, publicServerConfig.crvOrSize, {
        use: "enc",
        key_ops: ["deriveKey"],
    });

    expect(JWK.isKey(clientEncKey)).toBe(true);
    expect(clientEncKey.kty).toStrictEqual(publicServerConfig.kty);
    expect(clientEncKey.crv).toStrictEqual(publicServerConfig.crvOrSize);
    expect(clientEncKey.type).toBe("private");
    expect(clientEncKey.private).toBe(true);

    const pubServerSigKey = joseOnServer.getSigPubAsPEM();
    expect(JWK.isKey(JWK.asKey(pubServerSigKey))).toBe(true);
});

test("JWE key retrieval as PEM and en/decryption work", async () => {
    const cleartext = "karma";

    const serverPub = joseOnServer.getEncPubAsPEM();

    const jwe = joseOnServer.encrypt(cleartext, serverPub);

    const decryptionResult = joseOnServer.decrypt(jwe);

    expect(decryptionResult).toBe(cleartext);
});

test("JWE secure config retrieval works", async () => {
    // on client:
    // 1) get public jose config from server
    const publicServerConfig = joseOnServer.getPublicConfig();
    // 2) generate client-side enc key
    const clientEncKey = JWK.generateSync(publicServerConfig.kty, publicServerConfig.crvOrSize, {
        use: "enc",
        key_ops: ["deriveKey"],
    });
    // 3) securely retrieve full jose config from server
    const privateServerConfig = JSON.parse(JWE.decrypt(joseOnServer.getEncryptedConfig(clientEncKey), clientEncKey, {complete: false}).toString("utf8"));

    const confOnServer = require("../../config").jose;
    expect(privateServerConfig).toStrictEqual(confOnServer);
});

test("JWE client-side token signature verification with JWK pub works", async () => {
    // on client:
    // 1) get public jose config from server
    const publicServerConfig = joseOnServer.getPublicConfig();
    // 2) generate client-side enc key
    const clientEncKey = JWK.generateSync(publicServerConfig.kty, publicServerConfig.crvOrSize, {
        use: "enc",
        key_ops: ["deriveKey"],
    });
    // 3) securely retrieve full jose config from server
    const privateServerConfig = JSON.parse(JWE.decrypt(joseOnServer.getEncryptedConfig(clientEncKey), clientEncKey, {complete: false}).toString("utf8"));
    // 4) get server's signing public key
    const serverSigPub = joseOnServer.getSigPubAsPEM();

    // on server:
    // 1) get payload for user
    const payload = {
        sub: "1",
        aud: "/user",
    };
    // 3) sign with server's private key
    const jwt = joseOnServer.sign(payload);
    // for testing purposes we verify it on server right away:
    const serverVerificationResult = joseOnServer.verify(jwt);
    expect(serverVerificationResult.sub).toStrictEqual(payload.sub);
    expect(serverVerificationResult.aud).toStrictEqual(payload.aud);
    // -> works - valid JWT

    // on client
    // client-side signature verification works
    const clientVerificationResult = JWT.verify(jwt, serverSigPub, {
        audience: privateServerConfig.aud,
        complete: false,
        issuer: privateServerConfig.iss,
    });

    // client-side signature verification matches
    expect(clientVerificationResult).toStrictEqual(serverVerificationResult);
});

test("JWE client-side token signature verification with PEM pub works", async () => {
    // on client:
    // 1) get public jose config from server
    const publicServerConfig = joseOnServer.getPublicConfig();
    // 2) generate client-side enc key
    const clientEncKey = JWK.generateSync(publicServerConfig.kty, publicServerConfig.crvOrSize, {
        use: "enc",
        key_ops: ["deriveKey"],
    });
    // 3) securely retrieve full jose config from server
    const privateServerConfig = JSON.parse(JWE.decrypt(joseOnServer.getEncryptedConfig(clientEncKey), clientEncKey, {complete: false}).toString("utf8"));
    // 4) get server's signing public key
    const serverSigPub = joseOnServer.getSigPubAsPEM();

    // on server:
    // 1) get payload for user
    const payload = {
        sub: "1",
        aud: "/user",
    };
    // 3) sign with server's private key
    const jwt = joseOnServer.sign(payload);
    // for testing purposes we verify it on server right away:
    const serverVerificationResult = joseOnServer.verify(jwt);
    expect(serverVerificationResult.sub).toStrictEqual(payload.sub);
    expect(serverVerificationResult.aud).toStrictEqual(payload.aud);
    // -> works - valid JWT

    // on client
    // client-side signature verification works
    const clientVerificationResult = JWT.verify(jwt, serverSigPub, {
        audience: privateServerConfig.aud,
        complete: false,
        issuer: privateServerConfig.iss,
    });

    // client-side signature verification matches
    expect(clientVerificationResult).toStrictEqual(serverVerificationResult);
});

test("JWE client-side decryption works", async () => {
    // on client:
    // 1) get public jose config from server
    const publicServerConfig = joseOnServer.getPublicConfig();
    // 2) generate client-side enc key
    const clientEncKey = JWK.generateSync(publicServerConfig.kty, publicServerConfig.crvOrSize, {
        use: "enc",
        key_ops: ["deriveKey"],
    });
    // 3) securely retrieve full jose config from server
    const privateServerConfig = JSON.parse(JWE.decrypt(joseOnServer.getEncryptedConfig(clientEncKey), clientEncKey, {complete: false}).toString("utf8"));
    // 4) get server's signing public key
    const serverSigPub = joseOnServer.getSigPubAsPEM();

    // on server:
    // 1) get payload for user
    const payload = {
        sub: "1",
        aud: "/user",
    };
    // 3) sign with server's private key
    const jwt = joseOnServer.sign(payload);
    // for testing purposes we verify it on server right away:
    const serverVerificationResult = joseOnServer.verify(jwt);
    expect(serverVerificationResult.sub).toStrictEqual(payload.sub);
    expect(serverVerificationResult.aud).toStrictEqual(payload.aud);
    // -> works - valid JWT
    // 4) encrypt with client's public key
    const jwe = joseOnServer.encrypt(jwt, clientEncKey);

    // on client
    // 1) decrypt JWE with client's private key
    const decryptionResult = JWE.decrypt(jwe, clientEncKey, {
        complete: false,
    }).toString("utf8");

    // client-side decryption result matches server's jwt
    expect(decryptionResult).toStrictEqual(jwt);
});

test("JWE client-side decryption and token verification work", async () => {
    // on client:
    // 1) get public jose config from server
    const publicServerConfig = joseOnServer.getPublicConfig();
    // 2) generate client-side enc key
    const clientEncKey = JWK.generateSync(publicServerConfig.kty, publicServerConfig.crvOrSize, {
        use: "enc",
        key_ops: ["deriveKey"],
    });
    // 3) securely retrieve full jose config from server
    const privateServerConfig = JSON.parse(JWE.decrypt(joseOnServer.getEncryptedConfig(clientEncKey), clientEncKey, {complete: false}).toString("utf8"));
    // 4) get server's signing public key
    const serverSigPub = joseOnServer.getSigPubAsPEM();

    // on server:
    // 1) get payload for user
    const payload = {
        sub: "1",
        aud: "/user",
    };
    // 3) sign with server's private key
    const jwt = joseOnServer.sign(payload);
    // for testing purposes we verify it on server right away:
    const serverVerificationResult = joseOnServer.verify(jwt);
    expect(serverVerificationResult.sub).toStrictEqual(payload.sub);
    expect(serverVerificationResult.aud).toStrictEqual(payload.aud);
    // -> works - valid JWT
    // 4) encrypt with client's public key
    const jwe = joseOnServer.encrypt(jwt, clientEncKey);

    // on client
    // 1) decrypt JWE with client's private key
    const decryptionResult = JWE.decrypt(jwe, clientEncKey, {
        complete: false,
    }).toString("utf8");
    expect(decryptionResult).toStrictEqual(jwt);
    // 2) verify decryptionResult with server's public key
    const clientVerificationResult = JWT.verify(decryptionResult, serverSigPub, {
        audience: privateServerConfig.aud,
        complete: false,
        issuer: privateServerConfig.iss,
    });

    // client-side signature verification matches server's result
    expect(clientVerificationResult).toStrictEqual(serverVerificationResult);
});

test("JWE (combined) client-side decryption and token verification work", async () => {
    // on client:
    // 1) get public jose config from server
    const publicServerConfig = joseOnServer.getPublicConfig();
    // 2) generate client-side enc key
    const clientEncKey = JWK.generateSync(publicServerConfig.kty, publicServerConfig.crvOrSize, {
        use: "enc",
        key_ops: ["deriveKey"],
    });
    // 3) securely retrieve full jose config from server
    const privateServerConfig = JSON.parse(JWE.decrypt(joseOnServer.getEncryptedConfig(clientEncKey), clientEncKey, {complete: false}).toString("utf8"));
    // 4) get server's signing public key
    const serverSigPub = joseOnServer.getSigPubAsPEM();

    // on server:
    // 1) get payload for user
    const payload = {
        sub: "1",
        aud: "/user",
    };
    // 3) sign with server's private key and encrypt with client's public key
    const jwe = joseOnServer.signAndEncrypt(payload, clientEncKey);

    // on client
    // 1) decrypt JWE with client's private key
    const decryptionResult = JWE.decrypt(jwe, clientEncKey, {
        complete: false,
    }).toString("utf8");
    // 2) verify decryptionResult with server's public key
    const clientVerificationResult = JWT.verify(decryptionResult, serverSigPub, {
        audience: privateServerConfig.aud,
        complete: false,
        issuer: privateServerConfig.iss,
    });

    // client-side signature verification matches server's result
    expect(clientVerificationResult.sub).toStrictEqual(payload.sub);
    expect(clientVerificationResult.aud).toStrictEqual(payload.aud);
    expect(clientVerificationResult.iss).toStrictEqual(privateServerConfig.iss);
});

test("JWE complete server-client communication works", async () => {
    // on client:
    // 1) get public jose config from server
    const publicServerConfig = joseOnServer.getPublicConfig();
    // 2) generate client-side enc key
    const clientEncKey = JWK.generateSync(publicServerConfig.kty, publicServerConfig.crvOrSize, {
        use: "enc",
        key_ops: ["deriveKey"],
    });
    // 3) securely retrieve full jose config from server
    const privateServerConfig = JSON.parse(JWE.decrypt(joseOnServer.getEncryptedConfig(clientEncKey), clientEncKey, {complete: false}).toString("utf8"));
    // 4) get server's signing public key
    const serverSigPub = joseOnServer.getSigPubAsPEM();

    // on server:
    // 1) get payload for user
    const payload = {
        sub: "1",
        aud: "/user",
    };
    // 3) sign with server's private key and encrypt with client's public key
    const jwe = joseOnServer.signAndEncrypt(payload, clientEncKey);

    // on client
    // 1) decrypt JWE with client's private key
    const decryptionResult = JWE.decrypt(jwe, clientEncKey, {
        complete: false,
    }).toString("utf8");
    // 2) verify decryptionResult with server's public key
    const clientVerificationResult = JWT.verify(decryptionResult, serverSigPub, {
        audience: privateServerConfig.aud,
        complete: false,
        issuer: privateServerConfig.iss,
    });
    // since verification passed client knows JWT is indeed from server
    expect(clientVerificationResult.sub).toStrictEqual(payload.sub);
    expect(clientVerificationResult.aud).toStrictEqual(payload.aud);
    expect(clientVerificationResult.iss).toStrictEqual(privateServerConfig.iss);
    // since verification passed client knows JWT is indeed from server
    // 3) send jwt back to server with next (and every other) request encrypted by server's pub
    const serverEncPub = joseOnServer.getEncPubAsPEM();
    const jweInNextReq = JWE.encrypt(decryptionResult, serverEncPub,
        {
            enc: privateServerConfig.enc,
            alg: privateServerConfig.alg,
        });


    // on server:
    // 1) decryptAndVerify JWE from client
    const serverVerifResOnNextReq = joseOnServer.decryptAndVerify(jweInNextReq);
    const serverVerifResUserIdOnNextReq = joseOnServer.decryptVerifyAndGetUserId(jweInNextReq);

    expect(serverVerifResOnNextReq.sub).toStrictEqual(payload.sub);
    expect(serverVerifResOnNextReq.aud).toStrictEqual(payload.aud);
    expect(serverVerifResUserIdOnNextReq).toStrictEqual(Number.parseInt(payload.sub));
    expect(serverVerifResOnNextReq).toStrictEqual(clientVerificationResult);
});
