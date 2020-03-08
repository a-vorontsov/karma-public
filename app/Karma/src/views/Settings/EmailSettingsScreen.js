import React, {Component} from "react";
import {SafeAreaView, View, Text, Image, Switch} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import Colours from "../../styles/Colours";
import TextInput from "../../components/TextInput";

const request = require("superagent");

const logo = require("../../assets/images/settings-logos/email.png");

class EmailSettingsScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Email Settings" />
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
                    <RegularText style={Styles.pb24}>
                        Receive Promotional Emails:
                    </RegularText>
                    <Switch
                        style={Styles.switch}
                        value={false} // TODO - fetch from backend
                        trackColor={{
                            true: "#A9DCDF",
                            false: Colours.grey,
                        }}
                        thumbColor={Colours.grey}
                        onChange={()=>{}}
                        // onValueChange={() =>
                        //     this.setState({
                        //         isAddressVisible: !this.state
                        //             .isAddressVisible,
                        //     })
                        // }
                    />
                    <RegularText style={Styles.pb24}/>
                    <RegularText style={Styles.pb24}>
                        Your email address (read-only):
                    </RegularText>
                    <TextInput
                        inputRef={ref =>
                            (this.userEmailInput = ref)
                        }
                        placeholder="team-team@gmail.com"
                        name="userEmailInput"
                        editable={false}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

export default EmailSettingsScreen;
