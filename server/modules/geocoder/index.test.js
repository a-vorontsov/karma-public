test("geocoding an invalid key fails as expected", async () => {
    process.env.SKIP_GEOCODING = 0;
    process.env.MAPQUEST_API='karma69';
    const geocoder = require("./");
    expect(await geocoder.geocode({
        addressLine1: 123,
        addressLine2: 123,
        postCode: 123,
        townCity: 123,
        countryState: 123,
    })).toBe(null);
    process.env.SKIP_GEOCODING = 1;
});
