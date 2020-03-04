const crypto = require("crypto");

/**
 * Generate a secure random salt of schema defined length
 * (256-bits) and return value in hex.
 * @return {hex} 32-byte salt in hex
 */
function getSecureSaltInHex() {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate a secure random salt of schema defined length
 * (256-bits) and return value in Base64.
 * @return {base64} 32-byte salt in base64
 */
function getSecureSaltInBase64() {
    return crypto.randomBytes(32).toString("base64");
}

/**
 * Hashes the given password and salt concatenated with the
 * SHA-256 crypto standard hash function and returns the value in hex.
 * @param {string} password
 * @param {hex} secureSalt
 * @return {hex} 32-byte hash in hex
 */
function hashPassWithSaltInHex(password, secureSalt) {
    return crypto
        .createHash("sha256")
        .update(password + secureSalt)
        .digest("hex");
}

/**
 * Hashes the given password and salt concatenated with the
 * SHA-256 crypto standard hash function and returns the value in Base64.
 * @param {string} password
 * @param {base64} secureSalt
 * @return {base64} 32-byte hash in Base64
 */
function hashPassWithSaltInBase64(password, secureSalt) {
    return crypto
        .createHash("sha256")
        .update(password + secureSalt)
        .digest("base64");
}

module.exports = {
    getSecureSaltInHex: getSecureSaltInHex,
    getSecureSaltInBase64: getSecureSaltInBase64,
    hashPassWithSaltInHex: hashPassWithSaltInHex,
    hashPassWithSaltInBase64: hashPassWithSaltInBase64,
};
