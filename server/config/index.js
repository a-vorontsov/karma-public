const config = {};

config.jose = { // TODO: host on domain
    kty: "EC",
    crvOrSize: "P-256",
    alg: "ECDH-ES+A128KW",
    enc: "A128GCM",
    iss: "http://karma.laane.xyz/",
    exp: "30 d",
    aud: "/user",
};

config.josePermissions = {
    "/admin": "/admin",
    "/reset": "/reset",
    "/": "/user",
};

module.exports = config;
