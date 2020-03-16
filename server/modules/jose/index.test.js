const jose = require('jose');
const fs = require("fs");
const Base64 = require('js-base64').Base64;
const util = require("../../util/util");
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWS, // JSON Web Signature (JWS)
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

    const verificationResult = joseOnServer.verify(jwt, "1");

    expect(verificationResult.sub).toStrictEqual(payload.sub);
    expect(verificationResult.aud).toStrictEqual(payload.aud);

});

test("expired JWT is rejected as expected", async () => {

    const payload = {
        sub: "1",
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload, "1 s");

    await util.sleep(1200);

    expect(() => {
        joseOnServer.verify(jwt, "1");
    }).toThrow(new errors.JWTExpired("\"exp\" claim timestamp check failed"));

    expect(() => {
        joseOnServer.verify(jwt, "1");
    }).toThrow(errors.JWTClaimInvalid);

    expect(() => {
        joseOnServer.verify(jwt, "1");
    }).toThrow(errors.JWTExpired);

});

test("JWT with non-matching subject is rejected as expected", async () => {

    const payload = {
        sub: "1",
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    expect(() => {
        joseOnServer.verify(jwt, "2");
    }).toThrow(new errors.JWTClaimInvalid("unexpected \"sub\" claim value"));

    expect(() => {
        joseOnServer.verify(jwt, "2");
    }).toThrow(errors.JWTClaimInvalid);
});

test("JWT with non-matching audience is rejected as expected", async () => {

    const payload = {
        sub: "1",
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    expect(() => {
        joseOnServer.verify(jwt, "1", "/admin");
    }).toThrow(new errors.JWTClaimInvalid("unexpected \"aud\" claim value"));

    expect(() => {
        joseOnServer.verify(jwt, "1", "/admin");
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
        joseOnServer.verify(jwtRebuilt, "1");
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt, "1");
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
        joseOnServer.verify(jwtRebuilt, "1");
    }).toThrow(new errors.JWSVerificationFailed("signature verification failed"));

    expect(() => {
        joseOnServer.verify(jwtRebuilt, "1");
    }).toThrow(errors.JWSVerificationFailed);
});

    // const encKey = await JWK.generateSync("EC", "P-256", {
    //     use: "enc",
    //     key_ops: ["deriveKey"],
    // }, true);

    // console.log(encKey);
    // console.log(encKey.type);
    // console.log(encKey.algorithms());

    // const cyp = (JWE.encrypt('karma', encKey, { alg: 'ECDH-ES+A128KW', enc: 'A128GCM' }));
    // console.log(cyp);

    // console.log(JWE.decrypt(cyp, encKey).toString("utf8"));

    // const aesKey = "2b7e151628aed2a6abf7158809cf4f3c";

    // // const signKey = await JWK.generate("EC", "P-256", {
    // //     use: "sig",
    // //     key_ops: ["sign", "verify"],
    // // }, false);

    // // console.log(encKey);
    // // console.log("type:" + encKey.type);
    // // console.log(signKey);
    // // console.log("type:" + signKey.type);
    // // console.log(signKey.toPEM());

    // const keystore = new jose.JWKS.KeyStore(encKey);

    // const pubKey = JWK.asKey(keystore.get({
    //     kty: "EC",
    //     crv: "P-256",
    // }));

    // const actPubKey = await JWK.generate("EC", "P-256", {
    //     use: "enc",
    //     key_ops: ["encrypt", "decrypt"],
    // }, false);

    // console.log(pubKey);

    // const cypertext = JWE.encrypt("abc", actPubKey, {
    //     alg: "ECDH-ES",
    //     enc: "A128GCM",
    // });

    // console.log(cypertext);

    // const cleartext = JWE.decrypt(cypertext, encKey);

    // console.log(cleartext);


// test("rsa", async () => {

//     const encKey = await JWK.generate("RSA", 2048, {
//         use: "enc",
//         key_ops: ["encrypt", "decrypt"],
//     }, true);

//     const signKey = await JWK.generate("RSA", 2048, {
//         use: "enc",
//         key_ops: ["encrypt", "decrypt"],
//     }, false);

//     console.log(encKey);
//     console.log(encKey.type);
//     console.log(encKey.toPEM());


//     console.log(signKey);
//     console.log(signKey.type);
//     console.log(signKey.toPEM());

// });