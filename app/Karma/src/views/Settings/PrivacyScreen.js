import React, {Component} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {Image, SafeAreaView, View, Dimensions} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import {REACT_APP_API_URL} from "react-native-dotenv";
import {ScrollView} from "react-native-gesture-handler";
const {height: SCREEN_HEIGHT} = Dimensions.get("window");

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
            <SafeAreaView style={[Styles.container]}>
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
                <View style={[Styles.ph24]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[{flex: 1,
                        marginBottom: 150,
                        minHeight: SCREEN_HEIGHT}]}>
                            <RegularText style={Styles.pb11}>
                            {this.state.privacyPolicyText}
                        </RegularText>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

export default PrivacyScreen;
