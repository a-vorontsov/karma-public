import {StyleSheet, Dimensions} from "react-native";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

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
        fontFamily: "Arial",
        textAlignVertical: "top",
        textAlign: "left",
        paddingTop: 20,
        paddingBottom: 25,
        color: "#3bbfb2",
    },

    textInput: {
        width: SCREEN_WIDTH,
        height: 45,
        borderColor: "transparent",
        borderBottomColor: "#D3D3D3",
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 20,
        fontSize: 20,
        lineHeight: 20,
        color: "#7F7F7F",
        fontFamily: "OpenSans-Regular",
    },
    checkBox: {
        paddingRight: 20,
    },

    linkColour: {
        color: "#3bbfb2",
    },
});

export default SignUpStyles;
