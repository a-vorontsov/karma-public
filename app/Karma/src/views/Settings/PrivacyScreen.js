import React, {Component} from "react";
import {Image, SafeAreaView, View} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";

const request = require("superagent");

const logo = require("../../assets/images/settings-logos/privacy.png");

function loadPrivacyPolicy(screen) {
    request
        .post("https://baconipsum.com/api/?type=meat-and-filler")
        .then(res => {
            console.log(res.body);
            screen.setState({
                privacyPolicyText: res.body,
            });
        })
        .catch(er => {
            console.log(er.message);
        });
}

class PrivacyScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            privacyPolicyText: "Loading...",
        };
        loadPrivacyPolicy(this);
    }

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Privacy Policy" />
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 30,
                    }}>
                    <Image source={logo} />
                </View>
                <View style={Styles.ph24}>
                    <RegularText style={Styles.pb11}>
                        {this.state.privacyPolicyText}
                    </RegularText>
                </View>
            </SafeAreaView>
        );
    }
}

export default PrivacyScreen;
