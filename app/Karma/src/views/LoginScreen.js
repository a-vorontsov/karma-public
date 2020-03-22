import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import Styles from "../styles/Styles";
import Colours from "../styles/Colours";
import {RegularText} from "../../components/text";

class LoginScreen extends Component {
    static navigationOptions = {headerShown: false};
    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginBottom: 40,
                    }}>
                    <TouchableOpacity
                        style={[styles.button, {marginBottom: 20}]}
                        onPress={this._onPressButton}>
                        <RegularText style={[styles.text, {fontSize: 20}]}>
                            Login
                        </RegularText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        justifyContent: "center",
        textAlign: "center",
        color: Colours.black,
    },
    button: {
        alignItems: "center",
        backgroundColor: "transparent",
        borderColor: Colours.white,
        borderWidth: 2,
        borderRadius: 30,
        paddingHorizontal: 125,
        paddingVertical: 10,
    },
});
export default LoginScreen;
