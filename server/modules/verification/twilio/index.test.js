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

test("attempting to verify an invalid phone number is rejected as expected", () => {
    expect(() => {
        twilio.startPhoneVerification("abc");
    }).toThrow(new Error("Invalid phone number: 'abc'"));
});

test("attempting to verify a valid phone number is executed as expected",  () => {
    expect(() => {
        twilio.startPhoneVerification("+447577777777");
    }).not.toThrow(new Error("Invalid phone number: 'abc'"));
});

test("checking verification status of an invalid phone number is rejected as expected", () => {
    expect(() => {
        twilio.checkPhoneVerification("abc");
    }).toThrow(new Error("Invalid phone number: 'abc'"));
});

test("checking verification status of a valid phone number is executed as expected", () => {
    expect(() => {
        twilio.checkPhoneVerification("+447577777777");
    }).not.toThrow(new Error("Invalid phone number: 'abc'"));
});
