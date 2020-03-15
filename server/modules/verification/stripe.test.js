const stripe = require("./stripe");
const util = require("../../util/util");

test("immediate response is false", async () => {
    await stripe.uploadFile(1);
    expect(stripe.updateAccount(1)).toBe(false);
});

test("response is true after wait", async () => {
    await stripe.uploadFile(2);
    await waitForAccountUpdate();
    expect(stripe.updateAccount(2)).toBe(true);
});

/* eslint-disable require-jsdoc */
async function waitForAccountUpdate() {
    await util.sleep(1250);
}
