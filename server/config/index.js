const config = {};

config.jose = { // TODO: host on domain
    kty: "EC",
    crvOrSize: "P-256",
    alg: "ECDH-ES+A128KW",
    enc: "A128GCM",
    iss: "https://karmaaaaaapp.co.uk",
    exp: "30 d",
    aud: "/user",
};

config.specialPermissions = {
    "/admin": "/admin",
    "/signin/reset": "/reset",
};

module.exports = config;
