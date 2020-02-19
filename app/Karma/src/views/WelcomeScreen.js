import React, {Component} from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
} from "react-native";
import {RegularText, LogoText} from "../components/text";
import {TransparentButton} from "../components/buttons";
import Styles from "../styles/Styles";
import {SafeAreaView} from "react-native-safe-area-context";

class WelcomeScreen extends Component {
    static navigationOptions = {headerShown: false};
    render() {
        const {navigate} = this.props.navigation;
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("#f8f8f8");
        }
        return (
            <SafeAreaView style={styles.container}>
                <View style={[Styles.vcenter, Styles.textCenter]}>
                    <LogoText
                        style={[
                            Styles.white,
                            Styles.textCenter,
                            {fontSize: 70},
                        ]}>
                        KARMA
                    </LogoText>
                    <RegularText
                        style={[
                            Styles.white,
                            Styles.textCenter,
                            Styles.xxxlarge,
                        ]}>
                        lorem ipsum
                    </RegularText>
                </View>

                <View style={[Styles.bottom, Styles.pb24]}>
                    <TransparentButton
                        onPress={() => navigate("InitSignup")}
                        white
                        title="Sign Up"
                    />

                    <TouchableOpacity onPress={this._onPressButton}>
                        <RegularText
                            style={[Styles.white, Styles.medium, Styles.pt8]}>
                            Already have an account? Login
                        </RegularText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#03A8AE",
    },
});

export default WelcomeScreen;
