const jose = require('jose');
const fs = require("fs");
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWS, // JSON Web Signature (JWS)
    JWT, // JSON Web Token (JWT)
    errors, // errors utilized by jose
} = jose;


test("jose", async () => {

    const encKey = await JWK.generateSync("EC", "P-256", {
        use: "enc",
        key_ops: ["deriveKey"],
    }, true);

    console.log(encKey);
    console.log(encKey.type);
    console.log(encKey.algorithms());

    const cyp = (JWE.encrypt('karma', encKey, { alg: 'ECDH-ES+A128KW', enc: 'A128GCM' }));
    console.log(cyp);

    console.log(JWE.decrypt(cyp, encKey).toString("utf8"));

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
});

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