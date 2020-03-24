import React, {Component} from "react";
import {SafeAreaView, View, Image, Switch, Dimensions} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import Colours from "../../styles/Colours";
import {TextInput} from "../../components/input";
import Toast from "react-native-simple-toast";
import {GradientButton} from "../../components/buttons";
import {getAuthToken} from "../../util/credentials";
const request = require("superagent");

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const formWidth = 0.6 * SCREEN_WIDTH;

const logo = require("../../assets/images/settings-logos/email.png");

class EmailSettingsScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            user: props.navigation.getParam("user"),
            promotionalEmails: 0,
            notifications: 0,
        };
        this.loadSettings();
        this.saveSettings = this.saveSettings.bind(this);
    }
    async loadSettings() {
        const authToken = await getAuthToken();
        request
            .get("http://localhost:8000/settings")
            .set("authorization", authToken)
            .then(res => {
                this.setState({
                    promotionalEmails: res.body.data.settings.email,
                    notifications: res.body.data.settings.notifications,
                });
            })
            .catch(er => {
                console.log(er.message);
            });
    }

    async saveSettings() {
        const authToken = await getAuthToken();
        request
            .post("http://localhost:8000/settings")
            .set("authorization", authToken)
            .send({
                email: this.state.promotionalEmails,
                notifications: this.state.notifications,
            })
            .then(res => {
                console.log(res.body.message);
                Toast.showWithGravity(
                    "Settings updated successfully.",
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                this.props.navigation.navigate("SettingsMenu", {
                    user: this.state.user,
                });
            })
            .catch(er => {
                console.log(er.message);
            });
    }

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Email Settings" />
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
                    <RegularText style={Styles.pb24}>
                        Receive Promotional Emails:
                    </RegularText>
                    <Switch
                        style={Styles.switch}
                        value={
                            this.state.promotionalEmails === 1 ? true : false
                        }
                        trackColor={{
                            true: "#A9DCDF",
                            false: Colours.grey,
                        }}
                        thumbColor={Colours.grey}
                        onValueChange={value =>
                            this.setState({promotionalEmails: value ? 1 : 0})
                        }
                    />
                    <RegularText style={Styles.pb24} />
                    <RegularText style={Styles.pb24}>
                        Receive Notifications Through Email:
                    </RegularText>
                    <Switch
                        style={Styles.switch}
                        value={this.state.notifications === 1 ? true : false}
                        trackColor={{
                            true: "#A9DCDF",
                            false: Colours.grey,
                        }}
                        thumbColor={Colours.grey}
                        onValueChange={value =>
                            this.setState({notifications: value ? 1 : 0})
                        }
                    />
                    <RegularText style={Styles.pb24} />
                    <RegularText style={Styles.pb24}>
                        Your email address (read-only):
                    </RegularText>
                    <TextInput
                        value={this.state.user.email}
                        name="userEmailInput"
                        editable={false}
                    />
                </View>
                <View style={{width: formWidth, marginLeft: 69, marginTop: 69}}>
                    <GradientButton onPress={this.saveSettings} title="Save" />
                </View>
            </SafeAreaView>
        );
    }
}

export default EmailSettingsScreen;
