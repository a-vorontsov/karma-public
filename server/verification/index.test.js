const verification = require("./");

test("invalid numbers rejected", () => {
    expect(verification.isPhoneNumberValid("123")).toBe(false);
    expect(verification.isPhoneNumberValid("44757777777a")).toBe(false);
    expect(verification.isPhoneNumberValid("447577777777")).toBe(false);
});

test("valid numbers not rejected", () => {
    expect(verification.isPhoneNumberValid("+447577777777")).toBe(true);
    expect(verification.isPhoneNumberValid("+37255555555")).toBe(true);
});