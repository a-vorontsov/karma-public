import {StyleSheet, Dimensions} from "react-native";

import Colours from "../styles/Colours";

const {width: viewportWidth} = Dimensions.get("window");

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideWidth = wp(85);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
export const itemHeight = itemWidth * 1.2;

const CarouselStyles = StyleSheet.create({
    slider: {
        marginTop: 0,
        overflow: "visible",
    },
    itemContainer: {
        width: itemWidth,
        height: itemHeight,
        overflow: "visible",
        paddingHorizontal: itemHorizontalMargin,
    },
    item: {
        backgroundColor: "white",
        position: "absolute",
        top: 8,
        bottom: 8,
        left: 8,
        borderRadius: 6,
        borderBottomWidth: 16,
        borderBottomColor: Colours.blue,
        paddingTop: 16,
        overflow: "visible",
    },
    shadow: {
        shadowColor: Colours.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
});

export default CarouselStyles;
