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


const encKey = await JWK.generate("EC", "P-256", {
    use: "enc",
    key_ops: ["encrypt", "decrypt"],
});

const signKey = await JWK.generate("EC", "P-256", {
    use: "sig",
    key_ops: ["sign", "verify"],
});

const keystore = new jose.JWKS.KeyStore(encKey, signKey);

const getEncPubAsJWK = () => {
    return keystore.get({
        kty: "EC",
        crv: "P-256",
        use: "enc",
    });
};

const getEncPubAsPEM = () => {
    return keystore.get({
        kty: "EC",
        crv: "P-256",
        use: "enc",
    }).toPEM();
};

const getSigPubAsJWK = () => {
    return keystore.get({
        kty: "EC",
        crv: "P-256",
        use: "sig",
    });
};

const getSigPubAsPEM = () => {
    return keystore.get({
        kty: "EC",
        crv: "P-256",
        use: "sig",
    }).toPEM();
};


module.exports = {
    getEncPubAsJWK,
    getEncPubAsPEM,
    getSigPubAsJWK,
    getSigPubAsPEM,
};