const jose = require('jose');
const fs = require("fs");
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWS, // JSON Web Signature (JWS)
    JWT, // JSON Web Token (JWT)
    errors, // errors utilized by jose
} = jose;


const signPrivKey = jose.JWK.asKey(fs.readFileSync("./keys/sign-priv.key", "utf8"));
const signPubKey = jose.JWK.asKey(fs.readFileSync("./keys/sign-pub.key", "utf8"));
const encPrivKey = jose.JWK.asKey(fs.readFileSync("./keys/enc-priv.key", "utf8"));
const encPubKey = jose.JWK.asKey(fs.readFileSync("./keys/enc-pub.key", "utf8"));

const keystore = new jose.JWKS.KeyStore(signPrivKey, signPubKey, encPrivKey, encPubKey);


module.exports = {

};