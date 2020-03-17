const filterer = require("./index.js");

test("incorrect filter is not valid", () => {
    expect(filterer.filterIsValid("Delete * from db")).toBe(false);
    expect(filterer.filterIsValid("womenOnly")).toBe(false);
    expect(filterer.filterIsValid("address")).toBe(false);
});
test("correct filter is  valid", () => {
    expect(filterer.filterIsValid("women_only")).toBe(true);
    expect(filterer.filterIsValid("physical")).toBe(true);
    expect(filterer.filterIsValid("add_info")).toBe(true);
    expect(filterer.filterIsValid("photo_id")).toBe(true);
    expect(filterer.filterIsValid("address_visible")).toBe(true);
});

test("where clause matches boolean filters specified", () => {
    expect(filterer.getWhereClause({booleans:["physical", "women_only"]})).toBe(" where physical = true and women_only = true ");
    expect(filterer.getWhereClause({booleans:["!physical", "women_only"]})).toBe(" where physical = false and women_only = true ");
    expect(filterer.getWhereClause({booleans:["!physical", "!women_only"]})).toBe(" where physical = false and women_only = false ");
    expect(filterer.getWhereClause({booleans:[]})).toBe("");
});

test("where clause matches object filters specified", () => {
    const filters = {
        booleans: [ 'physical', '!women_only' ],
        availabilityStart: '2020-03-03',
        availabilityEnd: '2020-12-03',
    }
    const expectedResponse = ` where physical = true and women_only = false and date >= \'${filters.availabilityStart}\' and date <= \'${filters.availabilityEnd}\' `;
    expect(filterer.getWhereClause(filters)).toBe(expectedResponse);
});

test("having only object filters and not booleans works", () => {
    const filters = {
        availabilityStart: '2020-03-03',
        availabilityEnd: '2020-12-03',
    }
    const expectedResponse = ` where date >= \'${filters.availabilityStart}\' and date <= \'${filters.availabilityEnd}\' `;
    expect(filterer.getWhereClause(filters)).toBe(expectedResponse);
});

test("having only availabilityEnd works", () => {
    const filters = {
        availabilityEnd: '2020-12-03',
    }
    const expectedResponse = ` where date <= \'${filters.availabilityEnd}\' `;
    expect(filterer.getWhereClause(filters)).toBe(expectedResponse);
});

test("having only availabilityStart filter works", () => {
    const filters = {
        availabilityStart: '2020-03-03',
    }
    const expectedResponse = ` where date >= \'${filters.availabilityStart}\' `;
    expect(filterer.getWhereClause(filters)).toBe(expectedResponse);
});

test("having no filters returns empty where clause", () => {
    const filters = {}
    expect(filterer.getWhereClause(filters)).toBe("");
});

test("where clause not affected by undefined and null values", () => {
    const filters = {
        booleans: [ 'physical', '!women_only' ],
        availabilityStart: null,
        availabilityEnd: null,
    }
    const expectedResponse = " where physical = true and women_only = false ";
    expect(filterer.getWhereClause(filters)).toBe(expectedResponse);
});
