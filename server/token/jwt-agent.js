const fs = require("fs");
const jwt = require("jsonwebtoken");
const iss = "Karma server";
const exp = "1h";
const alg = "ES256";
const sub = "server-app";
const aud = "app";
const privateKey = fs.readFileSync(
    "./token/pkc/server-client/priv.key",
    "utf8",
);
const publicKey = fs.readFileSync(
    "./token/pkc/server-client/pub.key",
    "utf8",
);

/**
 * Create a PKC signed JWT token with custom subject,
 * audience and payload.
 * Warning: only use this if you know what you are doing!
 * Signing alg: ECDSA using P-256 curve and SHA-256
 * @param {String} tokenSubject
 * @param {String} tokenAudience
 * @param {JSON} payload
 * @return {JSON} JWT token
 */
function signWithCustomOptions(tokenSubject, tokenAudience, payload) {
    return jwt.sign(payload, privateKey, {
        issuer: iss,
        subject: tokenSubject,
        audience: tokenAudience,
        expiresIn: exp,
        algorithm: alg,
    });
}

/**
 * Create a PKC signed JWT token with default subject,
 * audience and given payload.
 * Signing alg: ECDSA using P-256 curve and SHA-256
 * @param {JSON} payload
 * @return {JSON} JWT token
 */
function signWithDefaultOptions(payload) {
    return jwt.sign(payload, privateKey, {
        issuer: iss,
        subject: sub,
        audience: aud,
        expiresIn: exp,
        algorithm: alg,
    });
}

/**
 * Create a minimal sized PKC signed JWT token
 * only with required options and given payload.
 * Signing alg: ECDSA using P-256 curve and SHA-256
 * @param {JSON} payload
 * @return {JSON} JWT token
 */
function signWithMinimalOptions(payload) {
    return jwt.sign(payload, privateKey, {
        expiresIn: exp,
        algorithm: alg,
    });
}

/**
 * Verify given token with default options and
 * return decoded payload or one of the following errors:
 *  - if token expired, err == jwt expired
 *  - if issuer mismatch, err == invalid issuer
 *  - if subject mismatch, err == invalid subject
 *  - if audience mismatch, err == invalid audience
 *  - if token alg != ES256, err == invalid signature
 *  - if token is malformed, err == jtw malformed
 *  - if signature missing, err == jtw signature is required
 * @throws TokenExpiredError
 * @throws JsonWebTokenError
 * @param {JSON} token
 * @return {JSON} decoded token
 */
function verifyWithDefaultOptions(token) {
    return jwt.verify(token, publicKey, {
        audience: aud,
        issuer: iss,
        subject: sub,
        algorithms: alg,
    });
}

/**
 * Verify given token with minimal options and
 * return decoded payload or one of the following errors:
 *  - if token expired, err == jwt expired
 *  - if token alg != ES256, err == invalid signature
 *  - if token is malformed, err == jtw malformed
 *  - if signature missing, err == jtw signature is required
 * @throws TokenExpiredError
 * @throws JsonWebTokenError
 * @param {JSON} token
 * @return {JSON} decoded token
 */
function verifyWithMinimalOptions(token) {
    return jwt.verify(token, publicKey, {algorithms: alg});
}

module.exports = {
    signWithCustomOptions: signWithCustomOptions,
    signWithDefaultOptions: signWithDefaultOptions,
    signWithMinimalOptions: signWithMinimalOptions,
    verifyWithDefaultOptions: verifyWithDefaultOptions,
    verifyWithMinimalOptions: verifyWithMinimalOptions,
};
