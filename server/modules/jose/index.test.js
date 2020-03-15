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


test("jose", async () => {
    const priv = await JWK.generate("EC", "P-256", {
        use: "enc",
        key_ops: ["encrypt", "decrypt"],
    });
    // const priv2 = await JWK.generate("EC", "P-256", {
    //     use: "sig",
    // }, false);
    console.log(priv);
    console.log(priv.type);
    console.log(priv.toPEM());


    // const priv2 = await JWK.generate('RSA', 2048, {}, false);
    // console.log(priv2);
    // console.log(priv2.type);

    // const signPrivKey = jose.JWK.asKey(fs.readFileSync("./keys/sign-priv.key", "utf8"));
    // const signPubKey = jose.JWK.asKey(fs.readFileSync("./keys/sign-pub.key", "utf8"));
    // const encPrivKey = jose.JWK.asKey(fs.readFileSync("./keys/enc-priv.key", "utf8"));
    // const encPubKey = jose.JWK.asKey(fs.readFileSync("./keys/enc-pub.key", "utf8"));

    // const keystore = new jose.JWKS.KeyStore(signPrivKey, signPubKey, encPrivKey, encPubKey);

    // console.log(keystore.toJWKS());
});