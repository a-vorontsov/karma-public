const config = {};

config.jose = { // TODO: fetch at app start
    kty: "EC",
    crvOrSize: "P-256",
    alg: "ECDH-ES+A128KW",
    enc: "A128GCM",
};

module.exports = config;