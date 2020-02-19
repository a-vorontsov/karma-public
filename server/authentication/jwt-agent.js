const fs = require("fs");
const jwt = require("jsonwebtoken");
const toeknIssuer = "Karma app";
const tokenExpiry = "1h";
const algo = "ES512";
const privateKey = fs.readFileSync("./priv.key", "utf8");
const publicKey = fs.readFileSync("./pub.key", "utf8");
const defaultTokenSubject = "Karma app communication";
const defaultTokenAudiance = "user";

// var payload = {
//   data1: "Data 1",
//   data2: "Data 2",
//   data3: "Data 3",
//   data4: true
// };

// var signOptions = {
//   issuer: toeknIssuer,
//   subject: tokenSubject,
//   audience: tokenAudiance,
//   expiresIn: tokenExpiry,
//   algorithm: algo
// };

/**
 * ECDSA using P-521 curve and SHA-512 hash algorithm
 */
// var token = jwt.sign(payload, privateKey, signOptions);

function sign(tokenSubject, tokenAudiance, payload) {
    return jwt.sign(payload, privateKey, {
        issuer: toeknIssuer,
        subject: tokenSubject,
        audience: tokenAudiance,
        expiresIn: tokenExpiry,
        algorithm: algo
    })
}

function signWithDefaultParams(payload) {
  return jwt.sign(payload, privateKey, {
    issuer: toeknIssuer,
    subject: defaultTokenSubject,
    audience: defaultTokenAudiance,
    expiresIn: tokenExpiry,
    algorithm: algo
  });
}

module.exports = {
    sign: sign,
    signWithDefaultParams: signWithDefaultParams
}