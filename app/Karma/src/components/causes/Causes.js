export const Causes = {
    animals: require("../../assets/images/causes-logos/animals.png"),
    arts: require("../../assets/images/causes-logos/arts.png"),
    energy: require("../../assets/images/causes-logos/energy.png"),
    community: require("../../assets/images/causes-logos/community.png"),
    conservation: require("../../assets/images/causes-logos/conservation.png"),
    crisis: require("../../assets/images/causes-logos/crisis.png"),
    education: require("../../assets/images/causes-logos/education.png"),
    equality: require("../../assets/images/causes-logos/equality.png"),
    food: require("../../assets/images/causes-logos/food.png"),
    health: require("../../assets/images/causes-logos/health.png"),
    homelessness: require("../../assets/images/causes-logos/homelessness.png"),
    peace: require("../../assets/images/causes-logos/peace.png"),
    poverty: require("../../assets/images/causes-logos/poverty.png"),
    refugees: require("../../assets/images/causes-logos/refugees.png"),
    religious: require("../../assets/images/causes-logos/religious.png"),
};

export const WhiteCauses = {
    animals: require("../../assets/images/causes-logos/white/animals-white.png"),
    arts: require("../../assets/images/causes-logos/white/arts-white.png"),
    energy: require("../../assets/images/causes-logos/white/energy-white.png"),
    community: require("../../assets/images/causes-logos/white/community-white.png"),
    conservation: require("../../assets/images/causes-logos/white/conservation-white.png"),
    crisis: require("../../assets/images/causes-logos/white/crisis-white.png"),
    education: require("../../assets/images/causes-logos/white/education-white.png"),
    equality: require("../../assets/images/causes-logos/white/equality-white.png"),
    food: require("../../assets/images/causes-logos/white/food-white.png"),
    health: require("../../assets/images/causes-logos/white/health-white.png"),
    homelessness: require("../../assets/images/causes-logos/white/homelessness-white.png"),
    peace: require("../../assets/images/causes-logos/white/peace-white.png"),
    poverty: require("../../assets/images/causes-logos/white/poverty-white.png"),
    refugees: require("../../assets/images/causes-logos/white/refugees-white.png"),
    religious: require("../../assets/images/causes-logos/white/religious-white.png"),
};

export const getCauseImage = (cause, isWhite) => {
    return isWhite ? WhiteCauses[cause] : Causes[cause];
};
