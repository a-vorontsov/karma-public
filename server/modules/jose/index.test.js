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

    const encKey = await JWK.generate("EC", "P-256", {
        use: "enc",
        key_ops: ["encrypt", "decrypt"],
    }, true);

    const signKey = await JWK.generate("EC", "P-256", {
        use: "sig",
        key_ops: ["sign", "verify"],
    }, false);

    console.log(encKey);
    console.log("type:" + encKey.type);
    console.log(signKey);
    console.log("type:" + signKey.type);
    console.log(signKey.toPEM());

    const keystore = new jose.JWKS.KeyStore(encKey, signKey);

    console.log(keystore.toJWKS());

    console.log(keystore.get({
        kty: "EC",
        crv: "P-256",
        use: "sig",
    }));

    console.log(keystore.get({
        kty: "EC",
        crv: "P-256",
        use: "sig",
    }).toPEM());
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