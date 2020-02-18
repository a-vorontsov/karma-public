import React from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    StatusBar,
    Picker,
    Keyboard,
} from "react-native";
import {hasNotch} from "react-native-device-info";
import Styles from "../styles/Styles";
import SignUpStyles from "../styles/SignUpStyles";
import {Dropdown} from "react-native-material-dropdown";
import {
    RegularText,
    TitleText,
    SemiBoldText,
    LogoText,
    BoldText,
} from "../components/text";
import CheckBox from "../components/CheckBox";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import TextInput from "../components/TextInput";
import {GradientButton} from "../components/buttons";
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;
const LINK_COLOUR = "#3bbfb2";
const TEXT_COLOUR = "#7F7F7F";

export default class OrgSignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orgType: "",
            orgName: "",
            charityNumber: "",
            regDate: "",
            isLowIncome: false,
            isExempt: false,
        };
    }

    render() {
        const {navigate} = this.props.navigation;
        const data = [
            {value: "NGO (Non-Government Organisation"},
            {value: "Charity Option 1"},
            {value: "Charity Option 2"},
        ];

        return (
            <KeyboardAvoidingView
                style={Styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                enabled>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            minHeight: SCREEN_HEIGHT,
                            alignItems: "center",
                        }}>
                        {/**
                         * Header
                         */}
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "flex-start",
                                marginTop: hasNotch()
                                    ? 60
                                    : StatusBar.currentHeight,
                                alignItems: "flex-start",
                                width: FORM_WIDTH,
                            }}>
                            <View style={SignUpStyles.header}>
                                <TouchableOpacity
                                    onPress={() => navigate("InitSignup")}>
                                    <Text
                                        style={[
                                            SignUpStyles.LINK_COLOUR,
                                            {fontSize: 30},
                                        ]}>
                                        ←
                                    </Text>
                                </TouchableOpacity>
                                <TitleText style={SignUpStyles.headerText}>
                                    Sign Up
                                </TitleText>
                            </View>
                            <Text style={SignUpStyles.subheaderText}>
                                Create a new account
                            </Text>
                        </View>

                        <View
                            style={{
                                flex: 2,
                                alignItems: "center",
                                justifyContent: "space-evenly",
                            }}>
                            <View>
                                <Text
                                    style={{
                                        marginBottom: -20,
                                        color: TEXT_COLOUR,
                                    }}>
                                    Are you a:
                                </Text>
                                <Dropdown
                                    containerStyle={{width: FORM_WIDTH}}
                                    baseColor={TEXT_COLOUR}
                                    textColor={TEXT_COLOUR}
                                    value={data[0].value}
                                    data={data}
                                />
                            </View>

                            <TextInput
                                style={SignUpStyles.textInput}
                                placeholder="Charity number"
                                inputRef={ref => (this.charityNumber = ref)}
                                onSubmitEditing={() => this.regDate.focus()}
                            />
                            <TextInput
                                inputRef={ref => (this.regDate = ref)}
                                style={SignUpStyles.textInput}
                                placeholder="Date of Registration"
                                onSubmitEditing={() => this.orgLogo.focus()}
                            />
                            <View style={{width: FORM_WIDTH}}>
                                <BoldText>Exemptions</BoldText>
                                <Text style={(Styles.pt8, Styles.pb16)}>
                                    Please select why you are not registered
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingBottom: 10,
                                    }}>
                                    <CheckBox
                                        style={SignUpStyles.checkBox}
                                        onPressIn={() =>
                                            this.setState({
                                                isLowIncome: !this.state
                                                    .isLowIncome,
                                            })
                                        }
                                    />
                                    <Text
                                        style={{
                                            flexShrink: 1,
                                            color: TEXT_COLOUR,
                                        }}>
                                        <Text>
                                            Your income is below £5,000 or are
                                            'excepted'
                                        </Text>
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingBottom: 10,
                                    }}>
                                    <CheckBox
                                        style={SignUpStyles.checkBox}
                                        onPressIn={() =>
                                            this.setState({
                                                isExempt: !this.state.isExempt,
                                            })
                                        }
                                    />
                                    <Text
                                        style={{
                                            flexShrink: 1,
                                            color: TEXT_COLOUR,
                                        }}>
                                        You are exempt from regulation by the
                                        Charity Comission
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <SemiBoldText>Organisation Logo</SemiBoldText>
                                <View style={{flexDirection: "row"}}>
                                    <TextInput
                                        style={SignUpStyles.textInput}
                                        placeholder="Please add your organisation logo"
                                        inputRef={ref => (this.orgLogo = ref)}
                                        onChange={text => console.log(text)}
                                        onSubmitEditing={() =>
                                            Keyboard.dismiss()
                                        }
                                    />
                                    {/* <TouchableOpacity
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,}} >
                                        <Text>Hello</Text>
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                        </View>
                        <View
                            style={[
                                {
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    width: FORM_WIDTH,
                                },
                                Styles.pb24,
                            ]}>
                            <GradientButton
                                title="Next"
                                onPress={() => console.log("Sign Up")}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
