const fs = require("fs");
const jwt = require("jsonwebtoken");
const toeknIssuer = "Karma app";
const tokenExpiry = "1h";
const algo = "ES512";
const privateKey = fs.readFileSync("./priv.key", "utf8");
const publicKey = fs.readFileSync("./pub.key", "utf8");

var toeknSubject = "some subj";
var tokenAudiance = "user";

var payload = {
  data1: "Data 1",
  data2: "Data 2",
  data3: "Data 3",
  data4: true
};

var signOptions = {
 issuer: toeknIssuer,
 toeknSubject: toeknSubject,
 audience: tokenAudiance,
 expiresIn:  tokenExpiry,
 algorithm:  algo
};

/**
 * ECDSA using P-521 curve and SHA-512 hash algorithm
 */
var token = jwt.sign(payload,
  privateKey, signOptions
);