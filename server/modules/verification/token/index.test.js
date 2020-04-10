const tokenService = require("./");

test("token generating algorithm always returns secure random token of expected length", async () => {
    for (let length = 1; length <= 8; length++) {
        for (let i = 0; i < 1000; i++) {
            const token = tokenService.generateSecureToken(length);
            expect(token.length).toStrictEqual(length);
        }
    }
});
