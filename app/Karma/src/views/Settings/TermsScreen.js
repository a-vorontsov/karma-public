import React, {Component} from "react";
import {Image, SafeAreaView, View} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";

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
        this.loadUsageTerms();
    }

    loadUsageTerms = () => {
        request
            .get("http://localhost:8000/information?type=terms")
            .then(res => {
                console.log(res.body.message);
                this.setState({
                    termsText: res.body.data.information.content,
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
                    <RegularText style={Styles.pb11}>
                        {this.state.termsText}
                    </RegularText>
                </View>
            </SafeAreaView>
        );
    }
}

export default TermsScreen;
