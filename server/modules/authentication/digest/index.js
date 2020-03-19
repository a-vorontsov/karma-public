const crypto = require("crypto");

/**
 * Generate a secure random salt of schema defined length
 * (256-bits) and return value in hex.
 * @return {hex} 32-byte salt in hex
 */
function generateSecureSaltInHex() {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate a secure random salt of schema defined length
 * (256-bits) and return value in Base64.
 * @return {base64} 32-byte salt in base64
 */
function generateSecureSaltInBase64() {
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
    return hashVarargInHex(password, secureSalt);
}

/**
 * Hashes the given password and salt concatenated with the
 * SHA-256 crypto standard hash function and returns the value in Base64.
 * @param {string} password
 * @param {base64} secureSalt
 * @return {base64} 32-byte hash in Base64
 */
function hashPassWithSaltInBase64(password, secureSalt) {
    return hashVarargInBase64(password, secureSalt);
}

/**
 * Hash a variable number of arguments concatenated
 * with the SHA-256 crypto standard hash function and
 * return result in hex.
 * @param  {...any} args
 * @return {digest} Sha-256 hash in hex
 */
function hashVarargInHex(...args) {
    return hashInput(args.join("")).digest("hex");
}

/**
 * Hash a variable number of arguments concatenated
 * with the SHA-256 crypto standard hash function and
 * return result in Base64.
 * @param  {...any} args
 * @return {digest} Sha-256 hash in Base64
 */
function hashVarargInBase64(...args) {
    return hashInput(args.join("")).digest("base64");
}

/**
 * Hash a variable number of arguments concatenated
 * with the SHA-256 crypto standard hash function and
 * return result.
 * @param  {any} input
 * @return {digest} Sha-256 hash
 */
function hashInput(input) {
    return crypto
        .createHash("sha256")
        .update(input);
}

module.exports = {
    generateSecureSaltInHex: generateSecureSaltInHex,
    generateSecureSaltInBase64: generateSecureSaltInBase64,
    hashPassWithSaltInHex: hashPassWithSaltInHex,
    hashPassWithSaltInBase64: hashPassWithSaltInBase64,
    hashVarargInHex: hashVarargInHex,
    hashVarargInBase64: hashVarargInBase64,
};
