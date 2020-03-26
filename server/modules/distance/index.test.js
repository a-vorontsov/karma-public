const distance = require("./");

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

test("getting the distance between two points works", async () => {
    const dist = distance.getDistance({lat: 1, long: 1}, {lat: -1, long: -1}, "K");

    const dist2 = distance.getDistance({lat: 1, long: 1}, {lat: -1, long: -1}, "N");

    expect(dist / 1.609344).toStrictEqual(dist2 / 0.8684);
});

test("getting the distance between two of the same points works", async () => {
    const dist = distance.getDistance({lat: 1, long: 1}, {lat: 1, long: 1}, "K");

    const dist2 = distance.getDistance({lat: 1, long: 1}, {lat: 1, long: 1}, "N");

    expect(dist / 1.609344).toStrictEqual(dist2 / 0.8684);
});

test("resolving math corner case of dist > 1 works", async () => {
    const mockMath = Object.create(global.Math);
    mockMath.sin = () => 6;
    global.Math = mockMath;
    const dist = distance.getDistance({ lat: 1, long: -1 }, { lat: -1, long: 1 }, "K");
    expect(dist).toBe(0);
});
