const jose = require('jose');
const Base64 = require('js-base64').Base64;
const util = require("../../util/util");
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWT, // JSON Web Token (JWT)
    errors, // errors utilized by jose
} = jose;

const joseOnServer = require("./");

test("JWE key derivation and en/decryption work", async () => {

    const cleartext = "karma";

    const encKey = await JWK.generateSync("EC", "P-256");

    const jwe = joseOnServer.encrypt(cleartext, encKey);

    const decryptionResult = joseOnServer.decrypt(jwe, encKey);

    expect(decryptionResult).toBe(cleartext);

});


test("JWT signing with default and custom exp work", async () => {

    const payload = {
        sub: "1",
        aud: "/user"
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

test("JWT verification works", async () => {

    const payload = {
        sub: "1",
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const verificationResult = joseOnServer.verify(jwt);

    expect(verificationResult.sub).toStrictEqual(payload.sub);
    expect(verificationResult.aud).toStrictEqual(payload.aud);

});

test("expired JWT is rejected as expected", async () => {

    const payload = {
        sub: "1",
        aud: "/user"
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
        aud: "/user"
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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtHeader.typ = 'invalidType';

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + jwtSignature;

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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtHeader.kid = jwtHeader.kid.substring(jwtHeader.length - 5) + "abcde";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + jwtSignature;

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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtHeader.alg = "ES384";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + jwtSignature;

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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.exp = 1589909685;

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + jwtSignature;

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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.iat = 1584316685;

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + jwtSignature;

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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.iss = "https://karmaaaaaapp.com";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + jwtSignature;

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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.aud = "/admin";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + jwtSignature;

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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.aud = "/admin";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + jwtSignature;

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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.sub = "2";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + jwtSignature;

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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    jwtPayload.sub = "2";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + jwtSignature;

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
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));
    const jwtSignature = jwtSplit[2];

    const malformedSig = jwtSignature.substring(jwtSignature - 5) + "abcde";

    const jwtRebuilt = Base64.encodeURI(JSON.stringify(jwtHeader)) + "."
        + Base64.encodeURI(JSON.stringify(jwtPayload)) + "."
        + malformedSig;

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt);
    }).toThrow(errors.JWSVerificationFailed);
});

test("JWE key and token exchange work", async () => {

    const clientPub = await JWK.generateSync("EC", "P-256");

    const payload = {
        sub: "1",
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    const jwe = joseOnServer.signAndEncrypt(payload, clientPub);
    const jwe2 = joseOnServer.encrypt(jwt, clientPub);

    expect(jwe).not.toStrictEqual(jwe2);

    const decryptionResult1 = joseOnServer.decrypt(jwe, clientPub);
    const verifyResult1A = joseOnServer.verify(decryptionResult1);
    const verifyResult1B = joseOnServer.decryptAndVerify(jwe, clientPub);

    const decryptionResult2 = joseOnServer.decrypt(jwe2, clientPub);
    const verifyResult2A = joseOnServer.verify(decryptionResult2);
    const verifyResult2B = joseOnServer.decryptAndVerify(jwe, clientPub);

    expect(verifyResult1A).toStrictEqual(verifyResult1B);
    expect(verifyResult2A).toStrictEqual(verifyResult2B);
    expect(verifyResult1A.sub).toStrictEqual(verifyResult1B.sub)
    expect(verifyResult1A.aud).toStrictEqual(verifyResult1B.aud)
    expect(verifyResult1A.iss).toStrictEqual(verifyResult1B.iss)

    // console.log(verifyResult1A);
    // console.log(joseOnServer.getUserIdFromPayload(verifyResult1A));
    // console.log(joseOnServer.getSignatureFromJWT(jwt));
    console.log(joseOnServer.getConfig());
    console.log(joseOnServer.getEncryptedConfig(clientPub));
    console.log(joseOnServer.getEncryptedConfig(clientPub));
    const decrConf = joseOnServer.decrypt(joseOnServer.getEncryptedConfig(clientPub), clientPub);
    console.log(decrConf);
    console.log(JSON.parse(decrConf));
});
