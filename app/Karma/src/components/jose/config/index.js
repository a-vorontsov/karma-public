const config = {};

config.jose = {
    kty: "EC",
    crvOrSize: "P-256",
    alg: "ECDH-ES+A128KW",
    enc: "A128GCM",
    iss: "https://karmaaaaaapp.co.uk",
    exp: "30 d",
    aud: "/user",
};

module.exports = config;
