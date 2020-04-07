import React, {Component} from "react";
import {SafeAreaView, View, Alert} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText, SemiBoldText} from "../../components/text";
import {GradientButton, TransparentButton} from "../../components/buttons";
import {getAuthToken} from "../../util/credentials";
const request = require("superagent");
import {REACT_APP_API_URL} from "react-native-dotenv";
import AsyncStorage from "@react-native-community/async-storage";

class DeleteAccountScreen extends Component {
    constructor(props) {
        super(props);
    }

    deleteAccount = async () => {
        const {navigate} = this.props.navigation;
        this.setState({isFirstOpened: false});
        const authToken = await getAuthToken();
        await request
            .post(`${REACT_APP_API_URL}/profile/delete`)
            .set("authorization", authToken)
            .send({})
            .then(res => {
                AsyncStorage.getAllKeys()
                    .then(keys => AsyncStorage.multiRemove(keys))
                    .then(() => console.log("owo !!!"));
                Alert.alert(
                    "Successful account deletion",
                    "We've successfully deleted your account.",

                    [{text: "OK", onPress: () => navigate("Welcome")}],
                );
            })
            .catch(err => {
                Alert.alert(
                    "Unsuccessful account deletion",
                    "We didn't manage to detele your account, please try again.",

                    [{text: "OK", onPress: () => navigate("Settings")}],
                );
                console.log(err);
            });
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Delete Account" />
                </View>
                <View
                    style={[
                        Styles.ph24,
                        {
                            paddingVertical: 40,
                            alignItems: "center",
                            justifyContent: "center",
                        },
                    ]}>
                    <SemiBoldText
                        style={[
                            Styles.pv16,
                            {fontSize: 18, textAlign: "center"},
                        ]}>
                        Are you sure you would like to delete your account?
                    </SemiBoldText>
                    <RegularText
                        style={[
                            Styles.pv16,
                            {fontSize: 15, textAlign: "center"},
                        ]}>
                        Once deleted, your account cannot be restored.
                    </RegularText>
                    <View
                        style={[
                            Styles.pv16,
                            {
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignContent: "space-between",
                                alignItems: "center",
                            },
                        ]}>
                        <View style={{marginRight: 20}}>
                            <GradientButton
                                title="Confirm"
                                onPress={() => this.deleteAccount()}
                            />
                        </View>
                        <View style={{marginLeft: 20}}>
                            <TransparentButton
                                onPress={() => navigate("SettingsMenu")}
                                paddingHz={6}
                                title="Cancel"
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

export default DeleteAccountScreen;
