import { StyleSheet, Platform, StatusBar } from "react-native";
import { hasNotch } from "react-native-device-info";

const Styles = StyleSheet.create({
    center: {
        marginHorizontal: "auto"
    },
    safeAreaContainer: {
        flex: 1,
        paddingTop: hasNotch() ? StatusBar.currentHeight : 0,
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
    pt8: {
        paddingTop: 8
    },
    pt16: {
        paddingTop: 16
    },
    pt24: {
        paddingTop: 24
    },
    pb8: {
        paddingBottom: 8
    },
    pb16: {
        paddingBottom: 16
    },
    pb24: {
        paddingBottom: 24
    },
    roundButton: {
        padding: 12,
        alignItems: "center",
        borderRadius: 32,
        backgroundColor: "#01a7a6",
    },
    roundButtonTransparent: {
        borderColor: "#01a7a6",
        borderWidth: 2,
        backgroundColor: "transparent",
        padding: 10
    },
    roundButtonTransparentText: {
        color: "#01a7a6"
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
    }
});

export default Styles;
