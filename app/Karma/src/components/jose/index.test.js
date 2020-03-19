const jose = require('jose');
const {
    JWE, // JSON Web Encryption (JWE)
    JWK, // JSON Web Key (JWK)
    JWKS, // JSON Web Key Set (JWKS)
    JWT, // JSON Web Token (JWT)
    errors, // errors utilized by jose
} = jose;
const joseOnClient = require("./");

test("JWK key generation with public server config works", async () => {

    const clientPub = joseOnClient.getEncPubAsPEM();

    console.log(clientPub);

    expect(JWK.isKey(JWK.asKey(clientPub))).toBe(true);
    expect(JWK.asKey(clientPub).type).toBe("public");
    expect(JWK.asKey(clientPub).private).toBe(false);
});