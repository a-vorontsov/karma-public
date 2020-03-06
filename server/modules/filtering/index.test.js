const filterer = require("./index.js");

const filters = ["physical", "women_only"];
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

test("where clause matches filters specified", () => {
    expect(filterer.getWhereClause(["physical", "women_only"])).toBe(" where physical = true and women_only = true ");
    expect(filterer.getWhereClause(["!physical", "women_only"])).toBe(" where physical = false and women_only = true ");
    expect(filterer.getWhereClause(["!physical", "!women_only"])).toBe(" where physical = false and women_only = false ");
    expect(filterer.getWhereClause([])).toBe("");
});
