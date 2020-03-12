import React, {Component} from "react";
import {SafeAreaView, View, Image} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";

const request = require("superagent");

const logo = require("../../assets/images/settings-logos/privacy.png");

function loadUsageTerms(screen) {
    request
        .post("https://baconipsum.com/api/?type=meat-and-filler")
        .then(res => {
            console.log(res.body);
            screen.setState({
                termsText: res.body,
            });
        })
        .catch(er => {
            console.log(er.message);
        });
}

class TermsScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            termsText: "Loading...",
        };
        loadUsageTerms(this);
    }

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Privacy Policy Guidelines" />
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
                        {this.state.termsText}
                    </RegularText>
                </View>
            </SafeAreaView>
        );
    }
}

export default TermsScreen;
