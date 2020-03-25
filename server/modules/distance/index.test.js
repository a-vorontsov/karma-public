const distance = require("./");

test("getting the distance between two points works", async () => {
    const dist = distance.getDistance({lat: 1, long: 1}, {lat:-1, long:-1}, "K");

    const dist2 = distance.getDistance({ lat: 1, long: 1 }, { lat: -1, long: -1 }, "N");

    expect(dist / 1.609344).toStrictEqual(dist2 / 0.8684);
});

test("getting the distance between two of the same points works", async () => {
    const dist = distance.getDistance({ lat: 1, long: 1 }, { lat: 1, long: 1 }, "K");

    const dist2 = distance.getDistance({ lat: 1, long: 1 }, { lat: 1, long: 1 }, "N");

    expect(dist / 1.609344).toStrictEqual(dist2 / 0.8684);
});
