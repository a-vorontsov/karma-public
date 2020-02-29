import { StyleSheet } from "react-native";
import Colours from "./Colours";

const RadioButtonStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: 16,
    },
    button: {
        height: 40,
        width: 150,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: Colours.lightGrey,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonSelected: {
        backgroundColor: Colours.blue,
        borderWidth: 2,
        borderColor: Colours.blue,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "400",
        color: "gray",
    },
    buttonTextSelected: {
        color: "white",
    },
});

export default RadioButtonStyles;
