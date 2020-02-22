import {StyleSheet} from "react-native";

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
        borderColor: "#D3D3D3",
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonSelected: {
        backgroundColor: "#01a7a6",
        borderWidth: 2,
        borderColor: "#01a7a6",
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
