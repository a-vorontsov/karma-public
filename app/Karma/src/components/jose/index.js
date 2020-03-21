const jose = require("jose");
const config = {};
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWT, // JSON Web Token (JWT)
} = jose;

/**
 * Assign new config object to jose config.
 * @param {object} newConfig
 */
const setConfig = newConfig => {
    Object.assign(config, newConfig);
};

// const initialise = () => {
// TODO: fetch at app start
const publicConf = require("./config").jose;
setConfig(publicConf);
// }

/**
 * Synchronously generate an encryption key with
 * config-defined type and curve/size.
 */
const encKey = JWK.generateSync(config.kty, config.crvOrSize, {
    use: "enc",
    key_ops: ["deriveKey"],
});

/**
 * Initialise JSON Web Key Store
 */
const keystore = new JWKS.KeyStore(encKey);

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
    return keystore
        .get({
            kty: config.kty,
            crv: config.crvOrSize,
            use: "enc",
            key_ops: ["deriveKey"],
        })
        .toPEM();
};

/**
 * Encrypt given cleartext with specified public
 * key and return the resulting JWE object as a string.
 * @param {string} cleartext
 * @param {object} key JWK compatible public key of recipient
 * @return {string} JWE object as string
 */
const encrypt = (cleartext, key) => {
    return JWE.encrypt(cleartext, JWK.asKey(key), {
        enc: config.enc,
        alg: config.alg,
    });
};

/**
 * Decrypt given JWK object with owned
 * private key and return cleartext as a
 * utf8 string.
 * @param {string} jwe JWE object as string
 * @return {string} cleartext (utf8)
 */
const decrypt = jwe => {
    return JWE.decrypt(jwe, encKey, {
        complete: false,
    }).toString("utf8");
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
const verify = (token, pub, aud) => {
    return JWT.verify(token, pub, {
        audience: aud !== undefined ? aud : config.aud,
        complete: false,
        issuer: config.iss,
    });
};

/**
 * Decrypt and parse input encrypted config
 * object and set it as new config.
 * @param {string} encryptedNewConfig as JWE
 */
const setEncryptedConfig = encryptedNewConfig => {
    setConfig(JSON.parse(decrypt(encryptedNewConfig)));
};

module.exports = {
    getEncPubAsJWK, // TODO: ENFORCE PEM
    getEncPubAsPEM,
    encrypt,
    decrypt,
    verify,
    setEncryptedConfig, // TODO: run at comm start
};
