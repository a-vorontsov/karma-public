import React, {Component} from "react";
import {Image, SafeAreaView, View, Dimensions, ScrollView} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import {REACT_APP_API_URL} from "react-native-dotenv";
const {height: SCREEN_HEIGHT} = Dimensions.get("window");

const request = require("superagent");

const logo = require("../../assets/images/settings-logos/guidelines.png");

class GuidelinesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guidelinesText: "Loading...",
        };
    }

    async componentDidMount() {
        await this.loadGuidelines();
    }

    loadGuidelines = () => {
        request
            .get(`${REACT_APP_API_URL}/information?type=guidelines`)
            .then(res => {
                this.setState({
                    guidelinesText: res.body.data.information.content,
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
                    <PageHeader title="Community Guidelines" />
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 30,
                    }}>
                    <Image source={logo} />
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={Styles.ph24}>
                    <View
                        style={[
                            {
                                flex: 1,
                                marginBottom: 150,
                                minHeight: SCREEN_HEIGHT,
                            },
                        ]}>
                        <RegularText style={Styles.pb11}>
                            {this.state.guidelinesText}
                        </RegularText>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default GuidelinesScreen;
