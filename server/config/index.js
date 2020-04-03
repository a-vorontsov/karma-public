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

config.emailVerification = {
    validMinutes: 15,
    tokenLength: 6,
    mailSubject: "{token} Email Verification Code",
    mailBody: "{token} is your Karma verification code.",
};

config.passwordReset = {
    validMinutes: 15,
    tokenLength: 6,
    mailSubject: "{token} Password Reset Token",
    mailBody: "{token} is your Karma password reset code.",
};

module.exports = config;
