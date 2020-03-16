const jose = require('jose');
const config = require("../../config").jose;
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
 * @param {any} cleartext
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
 * The subject must be provided for a successful
 * verification, which should be the userId in
 * string format.
 * The audience may also be optionally provided,
 * for instance when validating access to routes
 * with custom permissions. An example is when
 * an unauthenticated user wishes to reset their
 * password and have been granted access via a
 * reset token. In this case the aud="/reset".
 * If the audience param is left out, the default
 * configuration will be used.
 * @param {object} token JWT token
 * @param {string} sub userId - must be provided
 * @param {string} [aud=default] default config will be used if omitted
 * @return {string} payload
 * @throws {JWTClaimInvalid} if sub undefined
 * @throws {jose.errors} for failed verification
 */
const verify = (token, sub, aud) => {
    if (sub === undefined) {
        throw new errors.JWTClaimInvalid("No subject specified in claim", token, "JWT sub must be specified.");
    }
    return JWT.verify(token, sigKey, {
        audience: aud !== undefined ? aud : config.aud,
        complete: false,
        issuer: config.iss,
        subject: sub,
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
 * @param {string} sub userId - must be provided
 * @param {string} [aud=default] default config will be used if omitted
 * @return {string} decrypted and verified payload
 */
const decryptAndVerify = (jwe, privateKey, sub, aud) => {
    const jwt = decrypt(jwe, privateKey);
    return verify(jwt, sub, aud);
};

module.exports = {
    getEncPubAsJWK,
    getEncPubAsPEM,
    getSigPubAsJWK,
    getSigPubAsPEM,
    encrypt,
    decrypt,
    sign,
    verify,
    signAndEncrypt,
    decryptAndVerify,
};
