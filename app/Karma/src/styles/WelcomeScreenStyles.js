import {StyleSheet} from "react-native";
import Colours from "./Colours";

const WelcomeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colours.blue,
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
