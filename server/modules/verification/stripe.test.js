const stripe = require("./stripe");

test("immediate response is false", () => {
  stripe.uploadFile(1);
  expect(stripe.updateAccount(1)).toBe(false);
});

test("valid numbers not rejected", () => {
  stripe.uploadFile(2);
  expect(setTimeout(stripe.updateAccount(2), 5000)).toBe(true);
});
