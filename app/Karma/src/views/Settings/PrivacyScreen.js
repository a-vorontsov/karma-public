import React, {Component} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {Image, SafeAreaView, View} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import {REACT_APP_API_URL} from "react-native-dotenv";
const request = require("superagent");

const logo = require("../../assets/images/settings-logos/privacy.png");

class PrivacyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            privacyPolicyText: "Loading...",
        };
    }

    async componentDidMount() {
        try {
            let values = await AsyncStorage.multiGet([
                "policy",
                "ACCESS_TOKEN",
            ]);
            let privacy = values[0][1];
            const authToken = values[1][1];
            if (privacy === "") {
                const res = await request
                    .get(`${REACT_APP_API_URL}/information`)
                    .set("authorization", authToken)
                    .query({type: "privacyPolicy"});
                console.log(res.body);
                privacy = res.body.data.information.content;
            }
            this.setState({
                privacyPolicyText: privacy,
            });
        } catch (err) {
            console.log(err);
        }
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
