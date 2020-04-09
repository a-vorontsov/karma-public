import {StyleSheet, Dimensions} from "react-native";
import Colours from "./Colours";
import {normalise} from "./Styles";
const {width: SCREEN_WIDTH} = Dimensions.get("window");

const CauseStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: 16,
        paddingHorizontal: 2,
        overflow: "visible",
    },
    button: {
        height: SCREEN_WIDTH / 3.6,
        width: SCREEN_WIDTH / 3.6,
        borderRadius: 10,
        marginVertical: 4,
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colours.white,
    },
    buttonDisplay: {
        height: SCREEN_WIDTH / 5,
        width: SCREEN_WIDTH / 5,
        borderRadius: 10,
        marginVertical: 4,
        paddingVertical: 16,
        marginHorizontal: 3,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colours.white,
        overflow: "visible",
    },
    buttonText: {
        fontSize: normalise(12),
        fontWeight: "400",
        color: Colours.grey,
    },
    buttonTextSelected: {
        fontSize: normalise(12),
        fontWeight: "400",
        color: Colours.white,
    },
    checkbox: {
        position: "absolute",
        top: 4,
        right: 8,
        color: "white",
    },
    shadow: {
        shadowColor: Colours.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    image: {
        flex: 1,
        height: 32,
        width: 32,
    },
    createActivityContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        paddingBottom: 16,
        overflow: "visible",
    },
});

export default CauseStyles;
