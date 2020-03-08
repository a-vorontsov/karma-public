import React from "react";
import {Alert, KeyboardAvoidingView, Platform, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import {GradientButton} from "../components/buttons";
import {AddressInput, PhoneInput} from "../components/input";
import PageHeader from "../components/PageHeader";
import {RegularText, SubTitleText} from "../components/text";
import Styles, {normalise} from "../styles/Styles";

export default class ContactInfoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {},
            phone: null,
        };
        this.onUpdate = this.onUpdate.bind(this);
    }

    goNext() {
        const {location, phone} = this.state;
        if (location.valid && phone) {
            this.props.navigation.navigate("PickCauses");
        } else {
            Alert.alert(
                "Error",
                "The address and phone that you have entered cannot be saved.\nPlease make sure that the information you have entered is correct.",
            );
        }
    }

    onUpdate(name, value) {
        this.setState({
            [name]: value,
        });
    }

    render() {
        return (
            <SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView
                    style={Styles.ph24}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    enabled>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always">
                        <View style={Styles.fullMinHeight}>
                            <View>
                                <PageHeader title="Contact Info" />
                                <SubTitleText style={{fontSize: normalise(26)}}>
                                    Where are you located?
                                </SubTitleText>
                                <RegularText style={Styles.pb8}>
                                    Charities need to know this info, and it
                                    lets us show you local events.
                                </RegularText>
                            </View>
                            <View style={Styles.pb16}>
                                <AddressInput
                                    onChange={i => this.onUpdate("location", i)}
                                />
                                <PhoneInput
                                    onChange={i => this.onUpdate("phone", i)}
                                />
                            </View>
                            <View style={[Styles.bottom, Styles.pb16]}>
                                <GradientButton
                                    onPress={() => this.goNext()}
                                    title="Next"
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}
