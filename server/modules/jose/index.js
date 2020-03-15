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

/**
 * Get the public key used for encryption-decryption
 * in JSON Web Key format.
 * @return {object} enc public key in JWK format
 */
const getEncPubAsJWK = () => {
    return keystore.get({
        kty: "EC",
        crv: "P-256",
        use: "enc",
    });
};

/**
 * Get the public key used for encryption-decryption
 * in Privacy-Enhanced Mail format
 * @return {object} enc public key in PEM format
 */
const getEncPubAsPEM = () => {
    return keystore.get({
        kty: "EC",
        crv: "P-256",
        use: "enc",
    }).toPEM();
};

/**
 * Get the public key used for signing-verifying
 * in JSON Web Key format.
 * @return {object} sig public key in JWK format
 */
const getSigPubAsJWK = () => {
    return keystore.get({
        kty: "EC",
        crv: "P-256",
        use: "sig",
    });
};

/**
 * Get the public key used for signing-verifying
 * in Privacy-Enhanced Mail format
 * @return {object} sig public key in PEM format
 */
const getSigPubAsPEM = () => {
    return keystore.get({
        kty: "EC",
        crv: "P-256",
        use: "sig",
    }).toPEM();
};

const encrypt = (cleartext) => {
    return JWE.encrypt(cleartext, JWK.asKey(getEncPubAsJWK()));
};

const decrypt = (cyphertext) => {
    return JWE.decrypt(cyphertext, encKey);
}

module.exports = {
    getEncPubAsJWK,
    getEncPubAsPEM,
    getSigPubAsJWK,
    getSigPubAsPEM,
    encrypt,
    decrypt,
};