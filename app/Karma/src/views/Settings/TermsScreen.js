import React, {Component} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {Image, SafeAreaView, View} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import {REACT_APP_API_URL} from "react-native-dotenv";

const request = require("superagent");

const logo = require("../../assets/images/settings-logos/terms.png");

class TermsScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            termsText: "Loading...",
        };
    }

    async componentDidMount() {
        try {
            let terms = AsyncStorage.getItem("terms");
            if (terms === "") {
                request
                    .get(`${REACT_APP_API_URL}/information`)
                    .query({type: terms})
                    .then(res => {
                        terms = res.body.data.information.content;
                    })
                    .catch(er => {
                        console.log(er.message);
                    });
            }
            this.setState({
                termsText: terms ? terms : "",
            });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Terms of Use" />
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
                    <RegularText style={Styles.pb8}>
                        {this.state.termsText}
                    </RegularText>
                </View>
            </SafeAreaView>
        );
    }
}

export default TermsScreen;
