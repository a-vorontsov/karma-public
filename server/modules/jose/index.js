const jose = require('jose');
const fs = require("fs");
const config = require("../../config");
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWS, // JSON Web Signature (JWS)
    JWT, // JSON Web Token (JWT)
    errors, // errors utilized by jose
} = jose;

const keystore = new jose.JWKS.KeyStore();

const initialise = async () => {
    const encKey = JWK.generateSync("EC", "P-256", {
        use: "enc",
        key_ops: ["deriveKey"],
    });

    const signKey = JWK.generateSync("EC", "P-256", {
        use: "sig",
        key_ops: ["sign", "verify"],
    });

    keystore.add(encKey);
    keystore.add(signKey);
};

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
        key_ops: ["deriveKey"],
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
        key_ops: ["deriveKey"],
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
        key_ops: ["sign", "verify"],
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
        key_ops: ["sign", "verify"],
    }).toPEM();
};

const encrypt = (cleartext, key) => {
    return JWE.encrypt(cleartext, JWK.asKey(key),
        {
            alg: config.jose.alg,
            enc: config.jose.enc,
        });
};

const decrypt = (jwe) => {
    return JWE.decrypt(jwe, encKey).toString("utf8");
};

module.exports = {
    initialise,
    getEncPubAsJWK,
    getEncPubAsPEM,
    getSigPubAsJWK,
    getSigPubAsPEM,
    encrypt,
    decrypt,
};
