import {StyleSheet} from "react-native";

const WelcomeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#03A8AE",
    },
    text: {
        justifyContent: "center",
        textAlign: "center",
        color: "white",
    },
    button: {
        alignItems: "center",
        backgroundColor: "transparent",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 30,
        paddingHorizontal: 96,
        paddingVertical: 10,
    },
});
export default WelcomeScreenStyles;
