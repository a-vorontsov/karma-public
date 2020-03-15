const jose = require('jose');
const fs = require("fs");
const Base64 = require('js-base64').Base64;
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

    console.log(encKey);
    console.log(encKey.type);

    const jwe = joseOnServer.encrypt(cleartext, encKey);

    console.log(jwe);

    const decryptionResult = joseOnServer.decrypt(jwe, encKey);

    console.log(decryptionResult);

    expect(decryptionResult).toBe(cleartext);

});


test("JWT signing with default and custom exp work", async () => {

    const payload = {
        sub: 1,
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);
    const jwtSplit = jwt.split(".");
    const jwtHeader = JSON.parse(Base64.decode(jwtSplit[0]));
    const jwtPayload = JSON.parse(Base64.decode(jwtSplit[1]));

    // console.log(jwt);
    // console.log(jwtHeader);
    // console.log(jwtPayload);

    const jwtWithCustomExp = joseOnServer.sign(payload, "15 m");
    const jwtWithCustomExpSplit = jwtWithCustomExp.split(".");
    const jwtWithCustomExpHeader = JSON.parse(Base64.decode(jwtWithCustomExpSplit[0]));
    const jwtWithCustomExpPayload = JSON.parse(Base64.decode(jwtWithCustomExpSplit[1]));


    // console.log(jwtWithCustomExp);
    // console.log(jwtWithCustomExpHeader);
    // console.log(jwtWithCustomExpPayload);

    expect(jwtHeader).toStrictEqual(jwtWithCustomExpHeader);
    expect(jwtPayload.sub).toStrictEqual(jwtWithCustomExpPayload.sub);
    expect(jwtPayload.aud).toStrictEqual(jwtWithCustomExpPayload.aud);
    expect(jwtPayload.iss).toStrictEqual(jwtWithCustomExpPayload.iss);
    expect(jwtPayload.exp).not.toStrictEqual(jwtWithCustomExpPayload.exp);
});

test("JWT verification works", async () => {

    const payload = {
        sub: 1,
        aud: "/user"
    };

    const jwt = joseOnServer.sign(payload);

    // console.log(jwt);

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