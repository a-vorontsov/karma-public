const filtersAllowed = ["women_only", "physical", "photo_id", "address_visible", "add_info"];

const getWhereClause = (filters) => {
    let clause = "";
    if (!filters) return clause;
    const availabilityStart = filters.availabilityStart;
    const availabilityEnd = filters.availabilityEnd;
    clause += " where ";
    filters.booleans.forEach(filter => {
        if (filter.startsWith("!") && filterIsValid(filter.substring(1))) {
            clause += filter.substring(1) + " = false ";
        } else if (filterIsValid(filter)) {
            clause += filter + " = true ";
        } else {
            return;
        }
        clause += "and ";
    });
    if (availabilityStart) clause+= `date >=  \'${availabilityStart}\' and `;
    if (availabilityEnd) clause+= `date <=  \'${availabilityEnd}\' and `;
    const lastIndex = clause.lastIndexOf("and");
    return clause.substring(0, lastIndex);
};

const filterIsValid = (filter) => {
    return filtersAllowed.includes(filter);
};


module.exports = {
    getWhereClause,
    filterIsValid,
};
