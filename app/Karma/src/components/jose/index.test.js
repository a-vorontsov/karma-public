const jose = require("jose");
const {
    JWK, // JSON Web Key (JWK)
} = jose;
const joseOnClient = require("./");

test("JWK key generation with public server config works", async () => {
    const clientPub = joseOnClient.getEncPubAsPEM();

    console.log(clientPub);

    expect(JWK.isKey(JWK.asKey(clientPub))).toBe(true);
    expect(JWK.asKey(clientPub).type).toBe("public");
    expect(JWK.asKey(clientPub).private).toBe(false);
});
