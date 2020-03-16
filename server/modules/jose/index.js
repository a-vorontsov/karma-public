const jose = require('jose');
const config = require("../../config").jose;
const authRepo = require("../../models/databaseRepositories/authenticationRepository");
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWT, // JSON Web Token (JWT)
    errors, // errors utilized by jose
} = jose;

const encKey = JWK.generateSync(config.kty, config.crvOrSize, {
    use: "enc",
    key_ops: ["deriveKey"],
});

const sigKey = JWK.generateSync(config.kty, config.crvOrSize, {
    use: "sig",
    key_ops: ["sign", "verify"],
});

const keystore = new JWKS.KeyStore(encKey, sigKey);

const blacklist = new Set(); // TODO: fetch

const getConfig = () => {
    return {...config};
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

/**
 * Encrypt given cleartext with specified public
 * key and return the resulting JWE object as a string.
 * @param {string} cleartext
 * @param {object} key JWK compatible public key
 * @return {string} JWE object as string
 */
const encrypt = (cleartext, key) => {
    return JWE.encrypt(cleartext, JWK.asKey(key),
        {
            enc: config.enc,
            alg: config.alg,
        });
};

/**
 * Decrypt given JWK object with specified
 * private key and return cleartext as a
 * utf8 string.
 * @param {string} jwe JWE object as string
 * @param {object} key JWK compatible private key
 * @return {string} cleartext (utf8)
 */
const decrypt = (jwe, key) => {
    return JWE.decrypt(jwe, key, {
        complete: false,
    }).toString("utf8");
};

/**
 * Decrypt given JWK object with owned
 * private key and return cleartext as a
 * utf8 string.
 * @param {string} jwe JWE object as string
 * @return {string} cleartext (utf8)
 */
const decryptWithOwnKey = (jwe) => {
    return decrypt(jwe, encKey);
};

/**
 * Sign provided payload and return the
 * signed JWT.
 * @param {JSON} payload
 * @param {string} [exp=default] default expiry will be used if omitted
 * @return {string} signed JWT
 */
const sign = (payload, exp) => {
    return JWT.sign(payload, sigKey, {
        header: {
            typ: "JWT",
        },
        issuer: config.iss,
        kid: true,
        expiresIn: exp !== undefined ? exp : config.exp,
    });
};

/**
 * Verify provided JWT with given params.
 * The pubic key of signee must be provided
 * for a successful verification.
 * The audience may also be optionally provided,
 * for instance when validating access to routes
 * with custom permissions. An example is when
 * an unauthenticated user wishes to reset their
 * password and have been granted access via a
 * reset token. In this case the aud="/reset".
 * If the audience param is left out, the default
 * configuration will be used.
 * @param {object} token JWT token
 * @param {string} [aud=default] default config will be used if omitted
 * @return {string} payload
 * @throws {JWTClaimInvalid} if sub undefined
 * @throws {jose.errors} for failed verification
 */
const verify = (token, aud) => {
    return verifyWithPub(token, JWK.asKey(getSigPubAsJWK()), aud);
};

/**
 * Verify provided JWT with given params.
 * The pubic key of signee must be provided
 * for a successful verification.
 * The audience may also be optionally provided,
 * for instance when validating access to routes
 * with custom permissions. An example is when
 * an unauthenticated user wishes to reset their
 * password and have been granted access via a
 * reset token. In this case the aud="/reset".
 * If the audience param is left out, the default
 * configuration will be used.
 * @param {object} token JWT token
 * @param {object} pub JWK public key of signee
 * @param {string} [aud=default] default config will be used if omitted
 * @return {string} payload
 * @throws {JWTClaimInvalid} if sub undefined
 * @throws {jose.errors} for failed verification
 */
const verifyWithPub = (token, pub, aud) => {
    return JWT.verify(token, pub, {
        audience: aud !== undefined ? aud : config.aud,
        complete: false,
        issuer: config.iss,
    });
};

/**
 * Sign provided payload with the server's private
 * key and asymmetrically encrypt the signed JWT by
 * the client provided publicKey.
 * This returns the encrypted JWE object as a string.
 * @param {JSON} payload
 * @param {object} publicKey client's pub used for encryption
 * @param {string} [exp=default] default expiry will be used if omitted
 * @return {string} JWE object as string
 */
const signAndEncrypt = (payload, publicKey, exp) => {
    const jwt = sign(payload, exp);
    return encrypt(jwt, publicKey);
};

/**
 * Decrypt and verify the given JWE.
 * // TODO: change this to take partner's pub for
 * JWT verification and not to take a priv (use global
 * final static thingy).
 * @param {string} jwe JWE object as string
 * @param {string} privateKey // TODO: set as final global once deployed
 * @param {string} [aud=default] default config will be used if omitted
 * @return {string} decrypted and verified payload
 */
const decryptAndVerify = (jwe, privateKey, aud) => {
    const jwt = decrypt(jwe, privateKey);
    return verify(jwt, aud);
};

/**
 * Get the userId from the provided
 * JWT by decoding the subject.
 * @param {object} payload
 * @return {Number} userId
 */
const getUserIdFromPayload = (payload) => {
    return Number.parseInt(payload.sub);
};

// this should only be used for invalidating tokens!
const getUserIdFromJWT = (jwt) => {
    const payload = JWT.decode(jwt, false);
    return getUserIdFromPayload(payload);
};

/**
 * Returns signature of JWT as a Base64 string.
 * @param {object} jwt
 * @return {string} signature
 */
const getSignatureFromJWT = (jwt) => {
    return jwt.split(".")[2];
};

const blacklistSignature = (sig) => {
    blacklist.add(sig);
};

const blacklistJWT = async (jwt) => {
    const userId = getUserIdFromJWT(jwt);
    const sig = getSignatureFromJWT(jwt);
    await authRepo.insert({
        token: sig,
        expiryDate: Date(Now()), // TODO:
        creationDate: Date(Now()), // TODO:
        userId: userId,
    });
    blacklistSignature(sig);
};

const fetchBlacklist = async () => {
    blacklist.clear();
    const dbResult = await authRepo.findAll();
    const dbResCount = dbResult.rows.length;
    if (dbResCount > 0) {
        for (let i = 0; i < dbResCount; i++) {
            blacklistSignature(dbResCount.rows[i].token);
        }
    };
};

const getEncryptedConfig = (pub) => {
    return encrypt(JSON.stringify(getConfig()), pub);
};

module.exports = {
    getEncPubAsJWK,
    getEncPubAsPEM,
    getSigPubAsJWK,
    getSigPubAsPEM,
    getConfig,
    getEncryptedConfig,
    encrypt,
    decrypt,
    sign,
    verify,
    signAndEncrypt,
    decryptAndVerify,
    getUserIdFromPayload,
    getSignatureFromJWT,
    blacklistJWT,
    fetchBlacklist,
};
