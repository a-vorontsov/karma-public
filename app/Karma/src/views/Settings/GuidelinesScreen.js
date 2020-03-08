import React, {Component} from "react";
import {SafeAreaView, View, Text, Image} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";

const request = require("superagent");

const logo = require("../../assets/images/settings-logos/K-logo.png");

function loadAboutData(screen) {
    request
        .post("https://baconipsum.com/api/?type=meat-and-filler")
        .then(res => {
            console.log(res.body);
            screen.setState({
                aboutText: res.body,
            });
        })
        .catch(er => {
            console.log(er.message);
        });
}

class GuidelinesScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            aboutText: "Loading...",
        };
        loadAboutData(this);
    }

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Community Guidelines" />
                </View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 30,
                }}>
                    <Image
                        source={logo}
                    />
                </View>
                <View style={Styles.ph24}>
                    <RegularText style={Styles.pb11}>
                            {this.state.aboutText}
                    </RegularText>
                </View>
            </SafeAreaView>
        );
    }
}

export default GuidelinesScreen;
