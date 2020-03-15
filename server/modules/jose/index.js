const jose = require('jose');
const fs = require("fs");
const config = require("../../config").jose;
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
    const encKey = JWK.generateSync(config.kty, config.crvOrSize, {
        use: "enc",
        key_ops: ["deriveKey"],
    });

    const signKey = JWK.generateSync(config.kty, config.crvOrSize, {
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
        kty: config.kty,
        crv: config.crvOrSize,
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
        kty: config.kty,
        crv: config.crvOrSize,
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
        kty: config.kty,
        crv: config.crvOrSize,
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
        kty: config.kty,
        crv: config.crvOrSize,
        use: "sig",
        key_ops: ["sign", "verify"],
    }).toPEM();
};

const encrypt = (cleartext, key) => {
    return JWE.encrypt(cleartext, JWK.asKey(key),
        {
            alg: config.alg,
            enc: config.enc,
        });
};

const decrypt = (jwe, key) => {
    return JWE.decrypt(jwe, key).toString("utf8");
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
