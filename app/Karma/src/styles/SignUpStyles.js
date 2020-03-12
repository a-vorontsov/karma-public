import {StyleSheet, Dimensions} from "react-native";
import Colours from "./Colours";

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;
const SignUpStyles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        fontWeight: "bold",
        color: "black",
        paddingLeft: 10,
    },
    subheaderText: {
        fontSize: 25,
        fontWeight: "bold",
        fontFamily: "OpenSans-Regular",
        textAlignVertical: "top",
        textAlign: "left",
        paddingTop: 20,
        paddingBottom: 25,
        color: Colours.cyan,
    },
    textInput: {
        width: FORM_WIDTH,
        height: 45,
        borderColor: "transparent",
        borderBottomColor: Colours.lightGrey,
        borderWidth: 1.5,
        marginTop: 5,
        marginBottom: 20,
        fontSize: 20,
        color: Colours.grey,
        fontFamily: "OpenSans-Regular",
    },
    checkBox: {
        paddingRight: 20,
    },
    text: {
        color: Colours.grey,
    },
    linkColour: {
        color: Colours.cyan,
    },
    errorMessage: {
        borderBottomColor: Colours.red,
        marginBottom: 10,
    },
    errorText: {
        color: Colours.red,
    },
    uploadButton: {
        height: 50,
        width: 200,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: Colours.lightGrey,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    uploadButtonText: {
        fontSize: 15,
        fontWeight: "400",
        color: "gray",
    },
});

export default SignUpStyles;
