import React, {Component} from "react";
import {SafeAreaView, View, Image, Switch, Dimensions} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import Colours from "../../styles/Colours";
import {TextInput} from "../../components/input";
import Toast from "react-native-simple-toast";
import {GradientButton} from "../../components/buttons";
import {getData} from "../../util/credentials";
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
            email:"",
            promotionalEmails:0,
            notifications:0
        }
        this.loadSettings();
        this.saveSettings = this.saveSettings.bind(this);
    }
    async loadSettings(){
        const credentials = await getData();
        //const authToken = credentials.password;
        const userId = credentials.username;
        request
        .get("http://localhost:8000/settings")
        .query({userId:userId})
        .then(res => {
            this.setState({
                email: res.body.data.settings.email,
                promotionalEmails:res.body.data.settings.promotionalEmails,
                notifications: res.body.data.settings.notifications,
            });
        })
        .catch(er => {
            console.log(er.message);
        });
    }

    async saveSettings(){
        const credentials = await getData();
        const authToken = credentials.password;
        const userId = credentials.username;
        request
        .post("http://localhost:8000/settings")
        .send({
            authToken:authToken,
            userId:userId,
            email:this.state.promotionalEmails,
            notifications:this.state.notifications,
        })
        .then(res => {
            console.log(res.body.message);
            Toast.showWithGravity("Settings updated successfully.", Toast.SHORT, Toast.BOTTOM);
            this.props.navigation.navigate("SettingsMenu")
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
                        value={this.state.promotionalEmails===1?true:false}
                        trackColor={{
                            true: "#A9DCDF",
                            false: Colours.grey,
                        }}
                        thumbColor={Colours.grey}
                        onValueChange={(value)=> this.setState({promotionalEmails: value? 1: 0})}
                    />
                    <RegularText style={Styles.pb24} />
                    <RegularText style={Styles.pb24}>
                        Receive Email Notifications:
                    </RegularText>
                    <Switch
                        style={Styles.switch}
                        value={this.state.notifications===1?true:false}
                        trackColor={{
                            true: "#A9DCDF",
                            false: Colours.grey,
                        }}
                        thumbColor={Colours.grey}
                        onValueChange={(value)=> this.setState({notifications: value? 1: 0})}
                    />
                    <RegularText style={Styles.pb24} />
                    <RegularText style={Styles.pb24}>
                        Your email address (read-only):
                    </RegularText>
                    <TextInput
                        inputRef={ref => (this.userEmailInput = ref)}
                        placeholder={this.state.email}
                        name="userEmailInput"
                        editable={false}
                    />
                </View>
                <View style={
                    {width: formWidth,marginLeft:69,marginTop:69}
            }>
                    <GradientButton
                        onPress={this.saveSettings}
                        title="Save"
                    />
                </View>
            </SafeAreaView>
        );
    }
}

export default EmailSettingsScreen;
