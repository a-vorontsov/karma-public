const filtersAllowed = ["women_only", "physical", "photo_id", "address_visible", "add_info"];

const getWhereClause = (filters) => {
    let clause = "";
    if (!filters) return clause;
    clause += " where ";
    filters.forEach(filter => {
        if (filter.startsWith("!") && filterIsValid(filter.substring(1))) {
            clause += filter.substring(1) + " = false ";
        } else if (filterIsValid(filter)) {
            clause += filter + " = true ";
        } else {
            return;
        }
        clause += "and ";
    });
    const lastIndex = clause.lastIndexOf("and");
    return clause.substring(0, lastIndex);
};

const filterIsValid = (filter) => {
    return filtersAllowed.includes(filter);
};

module.exports = {
    getWhereClause: getWhereClause,
};
