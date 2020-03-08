const validation = require("./index.js");
const testHelpers = require("../../test/testHelpers");

const event = testHelpers.getEvent();
const address = testHelpers.getAddress();

test("correct addresses accepted", () => {
    const correctAddress = {...address};
    expect(validation.validateAddress(correctAddress).errors.length).toBe(0);
});

test("incorrect addresses rejected", () => {
    const incorrectAddress = {...address};
    incorrectAddress.address1 = 15;
    expect(validation.validateAddress(incorrectAddress).errors.length).toBe(1);
    incorrectAddress.lat = -1000;
    expect(validation.validateAddress(incorrectAddress).errors.length).toBe(2);
    delete incorrectAddress.city;
    expect(validation.validateAddress(incorrectAddress).errors.length).toBe(3);
});

test("correct events accepted", () => {
    const correctEvent = {...event};
    expect(validation.validateEvent(correctEvent).errors.length).toBe(0);
});

test("incorrect addresses rejected", () => {
    const incorrectEvent = {...event};
    incorrectEvent.name = 15;
    expect(validation.validateEvent(incorrectEvent).errors.length).toBe(1);
    incorrectEvent.physical = "what?";
    expect(validation.validateEvent(incorrectEvent).errors.length).toBe(2);
    delete incorrectEvent.womenOnly;
    expect(validation.validateEvent(incorrectEvent).errors.length).toBe(3);
});
