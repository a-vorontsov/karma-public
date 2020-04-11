const config = {};

config.jose = {
    kty: "EC",
    crvOrSize: "P-256",
    alg: "ECDH-ES+A128KW",
    enc: "A128GCM",
    iss: "https://karma.laane.xyz/",
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
    validMinutes: 30,
    tokenLength: 6,
    waitSeconds: 60,
    dbTokenParam: "verificationToken",
    mailSubject: "Email Verification Code",
    mailBody: "is your Karma email verification code.",
};

config.passwordReset = {
    validMinutes: 15,
    tokenLength: 6,
    dbTokenParam: "token",
    mailSubject: "Password Reset Token",
    mailBody: "is your Karma password reset code.",
};

module.exports = config;
