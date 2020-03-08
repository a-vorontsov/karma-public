import {
    StyleSheet,
    StatusBar,
    Dimensions,
    Platform,
    PixelRatio,
} from "react-native";
import {hasNotch} from "react-native-device-info";
import Colours from "./Colours";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 375;

export function normalise(size) {
    const newSize = size * scale;
    if (Platform.OS === "ios") {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
}

const Styles = StyleSheet.create({
    center: {
        marginHorizontal: "auto",
    },
    vcenter: {
        flex: 2,
        justifyContent: "center",
    },
    textCenter: {
        textAlign: "center",
    },
    safeAreaContainer: {
        flex: 1,
        paddingTop: hasNotch() ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    alignJustifyCenterContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    stretchContainer: {
        flex: 1,
        alignSelf: "stretch",
    },
    fullMinHeight: {
        minHeight: SCREEN_HEIGHT - StatusBar.currentHeight,
    },
    p8: {
        padding: 8,
    },
    p16: {
        padding: 16,
    },
    p24: {
        padding: 24,
    },
    ph8: {
        paddingHorizontal: 8,
    },
    ph16: {
        paddingHorizontal: 16,
    },
    ph24: {
        paddingHorizontal: 24,
    },
    pv8: {
        paddingVertical: 8,
    },
    pv16: {
        paddingVertical: 16,
    },
    pv24: {
        paddingVertical: 24,
    },
    pt8: {
        paddingTop: 8,
    },
    pt16: {
        paddingTop: 16,
    },
    pt24: {
        paddingTop: 24,
    },
    pb8: {
        paddingBottom: 8,
    },
    pb16: {
        paddingBottom: 16,
    },
    pb24: {
        paddingBottom: 24,
    },
    mini: {
        fontSize: normalise(8),
    },
    small: {
        fontSize: normalise(14),
    },
    medium: {
        fontSize: normalise(16),
    },
    large: {
        fontSize: normalise(20),
    },
    xlarge: {
        fontSize: normalise(24),
    },
    xxlarge: {
        fontSize: normalise(32),
    },
    xxxlarge: {
        fontSize: normalise(36),
    },
    welcomeLogo: {
        fontSize: normalise(70),
    },
    roundButton: {
        padding: 12,
        alignItems: "center",
        borderRadius: 32,
        backgroundColor: Colours.blue,
    },
    roundButtonTransparent: {
        borderColor: Colours.blue,
        borderWidth: 2,
        backgroundColor: "transparent",
        padding: 10,
    },
    roundButtonTransparentWhite: {
        borderColor: Colours.white,
        borderWidth: 2,
        backgroundColor: "transparent",
        padding: 10,
    },
    buttonText: {
        fontSize: 20,
    },
    green: {
        color: Colours.blue,
    },
    cyan: {
        color: Colours.cyan,
    },
    link: {
        color: Colours.blue,
        textDecorationLine: "underline",
    },
    white: {
        color: Colours.white,
    },
    grey: {
        color: Colours.grey,
    },
    error: {
        color: Colours.red,
    },
    textInput: {
        alignSelf: "stretch",
        height: 45,
        borderColor: "transparent",
        borderBottomColor: Colours.lightGrey,
        borderWidth: 1.5,
        marginTop: 5,
        marginBottom: 20,
        fontSize: 20,
        lineHeight: 20,
        color: Colours.grey,
        fontFamily: "OpenSans-Regular",
    },
    textInputError: {
        borderBottomColor: Colours.red,
        marginBottom: 10,
    },
    textInputMiscText: {
        position: "absolute",
        right: 16,
        top: 16,
    },
    bgWhite: {
        backgroundColor: Colours.white,
    },
    bottom: {
        flex: 1,
        justifyContent: "flex-end",
    },
    stickyBottom: {
        position: "absolute",
        width: "100%",
        bottom: 0,
    },
});

export default Styles;
