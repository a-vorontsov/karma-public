import React, {Component} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {Image, SafeAreaView, View} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import {REACT_APP_API_URL} from "react-native-dotenv";
const request = require("superagent");

const logo = require("../../assets/images/settings-logos/K-logo.png");

class AboutKarmaScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aboutText: "Loading...",
        };
    }

    async componentDidMount() {
        try {
            let about = await AsyncStorage.getItem("about");
            if (about === "") {
                request
                    .get(`${REACT_APP_API_URL}/information`)
                    .set("authorization")
                    .query({type: about})
                    .then(res => {
                        console.log(res.body);
                        about = "";
                    })
                    .catch(er => {
                        console.log(er.message);
                    });
            }
            this.setState({
                aboutText: about,
            });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        console.log(this.state);
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
