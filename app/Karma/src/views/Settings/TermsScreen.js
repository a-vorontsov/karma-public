import React, {Component} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import {Image, SafeAreaView, View} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import {REACT_APP_API_URL} from "react-native-dotenv";
import {ScrollView} from "react-native-gesture-handler";

const request = require("superagent");

const logo = require("../../assets/images/settings-logos/terms.png");

class TermsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            termsText: "Loading...",
        };
    }

    async componentDidMount() {
        try {
            let values = await AsyncStorage.multiGet(["terms", "ACCESS_TOKEN"]);
            let terms = values[0][1];
            const authToken = values[1][1];
            if (terms === "") {
                const res = await request
                    .get(`${REACT_APP_API_URL}/information`)
                    .set("authorization", authToken)
                    .query({type: "terms"});
                terms = res.body.data.information.content;
            }
            this.setState({
                termsText: terms,
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <RegularText style={Styles.pb8}>
                            {this.state.termsText}
                        </RegularText>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

export default TermsScreen;
