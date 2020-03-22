import React, {Component} from "react";
import {Image, SafeAreaView, View} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";

const request = require("superagent");

const logo = require("../../assets/images/settings-logos/K-logo.png");

loadAboutText = screen => {
    request
        .get("http://localhost:8000/information?type=about")
        .then(res => {
            console.log(res.body.message);
            screen.setState({
                aboutText: res.body.data.information.content,
            });
        })
        .catch(er => {
            console.log(er.message);
        });
}

class AboutKarmaScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            aboutText: "Loading...",
        };
        loadAboutText(this);
    }

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="About Karma" />
                </View>
                <View style={Styles.ph24}>
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            margin: 30,
                        }}>
                        <Image source={logo} />
                    </View>
                    <RegularText style={Styles.pb11}>
                        {this.state.aboutText}
                    </RegularText>
                </View>
            </SafeAreaView>
        );
    }
}

export default AboutKarmaScreen;
