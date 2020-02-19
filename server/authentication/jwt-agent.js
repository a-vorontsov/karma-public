const fs = require("fs");
const jwt = require("jsonwebtoken");
const iss = "Karma app";
const exp = "1h";
const alg = "ES256";
const sub = "Karma app communication";
const aud = "user";
const privateKey = fs.readFileSync("./authentication/priv.key", "utf8");
const publicKey = fs.readFileSync("./authentication/pub.key", "utf8");

/**
 * ECDSA using P-256 curve and SHA-256 hash algorithm
 * @param {*} tokenSubject 
 * @param {*} tokenAudience 
 * @param {JSON} payload 
 */
function sign(tokenSubject, tokenAudience, payload) {
  return jwt.sign(payload, privateKey, {
      issuer: iss,
      subject: tokenSubject,
      audience: tokenAudience,
      expiresIn: exp,
      algorithm: alg
  });
}

/**
 * ECDSA using P-256 curve and SHA-256 hash algorithm
 * @param {JSON} payload 
 */
function signWithDefaultParams(payload) {
  return jwt.sign(payload, privateKey, {
    issuer: iss,
    subject: sub,
    audience: aud,
    expiresIn: exp,
    algorithm: alg
  });
}

module.exports = {
    sign: sign,
    signWithDefaultParams: signWithDefaultParams
}