const config = {};

config.jose = {
    kty: "EC",
    crvOrSize: "P-256",
    alg: "ECDH-ES+A128KW",
    enc: "A128GCM",
    iss: "http://karma.laane.xyz/",
    exp: "30 d",
    aud: "/user",
    sigAlg: "ES256",
};

config.josePermissions = {
    "/admin": "/admin",
    "/reset": "/reset",
    "/": "/user",
};

module.exports = config;
