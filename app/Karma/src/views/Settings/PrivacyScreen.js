import React, {Component} from "react";
import {Image, SafeAreaView, View} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import { REACT_APP_API_URL } from 'react-native-dotenv';
const request = require("superagent");

const logo = require("../../assets/images/settings-logos/privacy.png");

class PrivacyScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            privacyPolicyText: "Loading...",
        };
        this.loadPrivacyPolicy();
    }

    loadPrivacyPolicy = () => {
        request
            .get(`${REACT_APP_API_URL}/information?type=privacyPolicy`)
            .then(res => {
                console.log(res.body.message);
                this.setState({
                    privacyPolicyText: res.body.data.information.content,
                });
            })
            .catch(er => {
                console.log(er.message);
            });
    };

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
