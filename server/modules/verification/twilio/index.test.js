const twilio = require("./");

test("invalid numbers rejected", () => {
    expect(twilio.isPhoneNumberValid("123")).toBe(false);
    expect(twilio.isPhoneNumberValid("44757777777a")).toBe(false);
    expect(twilio.isPhoneNumberValid("447577777777")).toBe(false);
});

test("valid numbers not rejected", () => {
    expect(twilio.isPhoneNumberValid("+447577777777")).toBe(true);
    expect(twilio.isPhoneNumberValid("+37255555555")).toBe(true);
});
