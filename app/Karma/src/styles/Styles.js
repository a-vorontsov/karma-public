import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    center: {
        marginHorizontal: "auto"
    },
    container: {
        flex: 1,
    },
    p8: {
        padding: 8
    },
    p16: {
        padding: 16
    },
    p24: {
        padding: 24
    },
    ph8: {
        paddingHorizontal: 8
    },
    ph16: {
        paddingHorizontal: 16
    },
    ph24: {
        paddingHorizontal: 24
    },
    pv8: {
        paddingVertical: 8
    },
    pv16: {
        paddingVertical: 16
    },
    pv24: {
        paddingVertical: 24
    },
    roundButton: {
        padding: 12,
        alignItems: "center",
        borderRadius: 32,
        backgroundColor: "#01a7a6",
    },
    roundButtonTransparent: {
        marginVertical: 8,
        borderColor: "#01a7a6",
        borderWidth: 2,
        backgroundColor: "transparent",
    },
    roundButtonTransparentText: {
        color: "#01a7a6"
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 24
    }
});

export default Styles;
