const stripe = require("./stripe");

test("immediate response is false", async () => {
  await stripe.uploadFile(1);
  await expect(stripe.updateAccount(1)).toBe(false);
});

test("response is true after wait", async () => {
  await stripe.uploadFile(2);
  await waitForAccountUpdate();
  await expect(stripe.updateAccount(2)).toBe(true)
});

async function waitForAccountUpdate() {
  await sleep(1000);
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}  