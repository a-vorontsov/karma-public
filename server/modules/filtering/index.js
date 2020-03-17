const filtersAllowed = ["women_only", "physical", "photo_id", "address_visible", "add_info"];

const getWhereClause = (filters) => {
    let clause = "";
    const booleanFilters = filters.booleans;
    const availabilityStart = filters.availabilityStart;
    const availabilityEnd = filters.availabilityEnd;
    if (!booleanFilters && !availabilityStart && !availabilityEnd) return clause;
    clause += " where ";
    if (booleanFilters) {
        booleanFilters.forEach(filter => {
            if (filter.startsWith("!") && filterIsValid(filter.substring(1))) {
                clause += filter.substring(1) + " = false ";
            } else if (filterIsValid(filter)) {
                clause += filter + " = true ";
            } else {
                return;
            }
            clause += "and ";
        });
    }
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
