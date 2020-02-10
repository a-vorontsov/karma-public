import { StyleSheet } from "react-native";

import {
    Colors,
} from "react-native/Libraries/NewAppScreen";

const Styles = StyleSheet.create({
    center: {
        marginHorizontal: "auto"
    },
    engine: {
        position: "absolute",
        right: 0,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    container: {
        paddingHorizontal: 24,
    },
    roundButton: {
        padding: 16,
        alignItems: "center",
        borderRadius: 32,
        backgroundColor: "#01a7a6",
    },
    roundButtonTransparent: {
        marginVertical: 8,
        borderColor: "#01a7a6",
        borderWidth: 2,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    roundButtonTransparentText: {
        color: "#01a7a6"
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: Colors.black,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: Colors.black
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "400",
        color: Colors.dark,
    },
    highlight: {
        fontWeight: "700",
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: "600",
        padding: 4,
        paddingRight: 12,
        textAlign: "right",
    },
});

export default Styles;
