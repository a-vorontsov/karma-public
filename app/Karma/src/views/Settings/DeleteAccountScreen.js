import React, {Component} from "react";
import {SafeAreaView, View} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText, SemiBoldText} from "../../components/text";
import {GradientButton, TransparentButton} from "../../components/buttons";

class DeleteAccountScreen extends Component {
    static navigationOptions = {
        headerShown: false,
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
                            <GradientButton title="Confirm" />
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
