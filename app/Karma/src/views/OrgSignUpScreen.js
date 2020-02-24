import React from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    StatusBar,
    Picker,
    Image,
    Keyboard,
    Alert,
    StyleSheet,
} from "react-native";
import PhotoUpload from "react-native-photo-upload";
import {hasNotch} from "react-native-device-info";
import Styles from "../styles/Styles";
import SignUpStyles from "../styles/SignUpStyles";
import {Dropdown} from "react-native-material-dropdown";
import PageHeader from "../components/PageHeader";
import {TextInputMask} from "react-native-masked-text";

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
import {ThemeColors} from "react-navigation";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;
const LINK_COLOUR = "#3bbfb2";
const TEXT_COLOUR = "#7F7F7F";
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default class OrgSignUpScreen extends React.Component {
    constructor(props) {
        console.disableYellowBox = true;
        super(props);

        this.state = {
            orgType: "",
            orgName: "",
            charityNumber: "",
            regDate: "",
            email: "",
            password: "",
            confPassword: "",
            hidePassword: true,
            isLowIncome: false,
            isExempt: false,
            photo: null,
            submitPressed: false,
        };
    }

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
        console.log(name, text);
    };

    setPhoto(selectedPhoto) {
        this.setState({
            photo: selectedPhoto,
        });
    }

    isValidPassword = () => {
        return PASSWORD_REGEX.test(this.state.password);
    };

    uploadPhoto(selectedPhoto) {
        if (selectedPhoto != null) {
            Alert.alert("Success!", "Your new photo has been uploaded.");
        } else {
            Alert.alert("Error", "Please upload a photo.");
        }
    }

    getPasswordError = () => {
        let isValid = this.isValidPassword(this.state.password);
        let err;
        if (isValid) {
            if (this.state.password !== this.state.confPassword) {
                err = "Passwords must match";
            }
        } else {
            if (!this.state.password && this.state.confPassword) {
                err = "Passwords must match";
            } else {
                err = "Passwords must be at least 8 chars (upper/lower/digit)";
            }
        }
        return err;
    };

    submit = () => {
        const {navigate} = this.props.navigation;
        this.setState({submitPressed: true});
        if (
            !this.state.orgName ||
            !this.state.password ||
            !this.state.confPassword
        ) {
            return;
        }

        if (
            !this.state.charityNumber &&
            (!this.state.isExempt && !this.state.isLowIncome)
        ) {
            return;
        }
        navigate("About");
    };

    isValidDate = () => {
        const isValid = this.datetimeField.isValid();
        console.log(isValid, this.datetimeField.getRawValue());
        return isValid;
    };

    render() {
        const passwordError = this.getPasswordError();

        const showPasswordError =
            !this.state.password ||
            this.state.password !== this.state.confPassword ||
            !this.isValidPassword();

        const showDateError =
            this.state.submitPressed &&
            !this.isValidDate() &&
            (!this.state.isExempt && !this.state.isLowIncome);

        const {navigate} = this.props.navigation;
        const data = [
            {value: "NGO (Non-Government Organisation"},
            {value: "Charity Option 1"},
            {value: "Charity Option 2"},
        ];

        return (
            <View style={Styles.container}>
                {/** HEADER */}
                <View
                    style={{
                        alignItems: "center",
                        height: 0.1 * SCREEN_HEIGHT,
                        justifyContent: "flex-start",
                        marginTop: hasNotch() ? 30 : StatusBar.currentHeight,
                    }}>
                    <View style={{alignItems: "flex-start", width: FORM_WIDTH}}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                            }}>
                            <TouchableOpacity
                                onPress={() => navigate("InitSignup")}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 45,
                                        resizeMode: "contain",
                                    }}
                                    source={require("../assets/images/general-logos/back-arrow.png")}
                                />
                            </TouchableOpacity>
                            <RegularText
                                style={{
                                    fontSize: 30,
                                    fontWeight: "500",
                                    color: "#3E3E3E",
                                    paddingLeft: 20,
                                }}>
                                Sign Up
                            </RegularText>
                        </View>

                        <SemiBoldText
                            style={{
                                color: "#01a7a6",
                                fontSize: 25,
                            }}>
                            Create a new account
                        </SemiBoldText>
                    </View>
                </View>
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View
                            style={{
                                minHeight: SCREEN_HEIGHT,
                                justifyContent: "space-evenly",
                                alignItems: "center",
                            }}>
                            <Dropdown
                                label="Are you a:"
                                containerStyle={{width: FORM_WIDTH}}
                                baseColor={TEXT_COLOUR}
                                textColor={TEXT_COLOUR}
                                itemTextStyle={{fontFamily: "OpenSans-Regular"}}
                                value={data[0].value}
                                data={data}
                                animationDuration={200}
                            />
                            <TextInput
                                placeholder="Charity or Organisation name"
                                onChange={this.onChangeText}
                                onSubmitEditing={() =>
                                    this.charityNumber.focus()
                                }
                                name="orgName"
                                showError={
                                    this.state.submitPressed
                                        ? !this.state.orgName
                                        : false
                                }
                            />
                            <TextInput
                                inputRef={ref => (this.charityNumber = ref)}
                                placeholder="Charity Number"
                                onChange={this.onChangeText}
                                name="charityNumber"
                                onSubmitEditing={() => this.password.focus()}
                                showError={
                                    this.state.submitPressed
                                        ? !this.state.charityNumber &&
                                          (!this.state.isExempt &&
                                              !this.state.isLowIncome)
                                        : false
                                }
                            />
                            <TextInput
                                placeholder="team-team@gmail.com"
                                editable={false}
                            />
                            {/** PASSWORD FIELDS */}
                            <View
                                style={{
                                    flexDirection: "row",
                                }}>
                                <TextInput
                                    inputRef={ref => (this.password = ref)}
                                    placeholder="Password"
                                    secureTextEntry={this.state.hidePassword}
                                    onChange={this.onChangeText}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() =>
                                        this.confirmPassword.focus()
                                    }
                                    name="password"
                                    showError={
                                        this.state.submitPressed
                                            ? showPasswordError
                                            : false
                                    }
                                    errorText={
                                        !this.state.password ? undefined : ""
                                    }
                                />
                            </View>
                            <View
                                style={{
                                    width: FORM_WIDTH,
                                    flexDirection: "row",
                                }}>
                                <TextInput
                                    inputRef={ref =>
                                        (this.confirmPassword = ref)
                                    }
                                    placeholder="Confirm Password"
                                    secureTextEntry={this.state.hidePassword}
                                    onChange={this.onChangeText}
                                    blurOnSubmit={false}
                                    name="confPassword"
                                    onSubmitEditing={() => this.regDate.focus()}
                                    showError={
                                        this.state.submitPressed
                                            ? showPasswordError
                                            : false
                                    }
                                    errorText={passwordError}
                                />
                                <TouchableOpacity
                                    style={{
                                        position: "absolute",
                                    }}>
                                    <Text>why not working</Text>
                                </TouchableOpacity>
                                {/* <Text style={{position: "absolute"}}>
                                    why not working
                                </Text> */}
                            </View>
                            {/** DATE INPUT */}
                            <View>
                                <TextInputMask
                                    refInput={ref => (this.regDate = ref)}
                                    placeholder="Date of registration ('D/M/Y')"
                                    style={
                                        showDateError
                                            ? [
                                                  SignUpStyles.textInput,
                                                  SignUpStyles.errorMessage,
                                              ]
                                            : SignUpStyles.textInput
                                    }
                                    type={"datetime"}
                                    options={{
                                        format: "DD/MM/YYYY",
                                    }}
                                    name="regDate"
                                    value={this.state.regDate}
                                    onChangeText={text => {
                                        this.setState({
                                            regDate: text,
                                        });
                                    }}
                                    onSubmitEditing={this.isValidDate}
                                    ref={ref => (this.datetimeField = ref)}
                                />
                                {showDateError ? (
                                    <Text style={SignUpStyles.errorText}>
                                        Please Enter a valid date
                                    </Text>
                                ) : null}
                            </View>

                            {/** EXEMPTION REASONS */}
                            <View style={{width: FORM_WIDTH}}>
                                <BoldText style={SignUpStyles.text}>
                                    Exemptions
                                </BoldText>
                                <Text
                                    style={[
                                        SignUpStyles.text,
                                        Styles.pt8,
                                        Styles.pb16,
                                        {fontFamily: "OpenSans-Regular"},
                                    ]}>
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
                                        <RegularText>
                                            Your income is below £5,000 or are
                                            'excepted'
                                        </RegularText>
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
                                    <RegularText
                                        style={{
                                            flexShrink: 1,
                                            color: TEXT_COLOUR,
                                        }}>
                                        You are exempt from regulation by the
                                        Charity Comission
                                    </RegularText>
                                </View>
                            </View>
                            {/** PHOTO UPLOAD */}
                            <View
                                style={{
                                    alignItems: "flex-start",
                                    width: FORM_WIDTH,
                                }}>
                                <RegularText
                                    style={[SignUpStyles.text, {fontSize: 20}]}>
                                    Organisation Logo
                                </RegularText>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    width: FORM_WIDTH,
                                }}>
                                <PhotoUpload
                                    containerStyle={{
                                        alignItems: "center",
                                    }}
                                    onPhotoSelect={avatar => {
                                        if (avatar) {
                                            console.log(
                                                "Image base64 string: ",
                                                avatar,
                                            ),
                                                this.setPhoto(avatar);
                                        }
                                    }}>
                                    <Image
                                        style={{
                                            paddingVertical: 10,
                                            width: 50,
                                            height: 50,
                                            borderRadius: 75,
                                        }}
                                        resizeMode="cover"
                                        source={require("../assets/images/general-logos/photo-logo.png")}
                                    />
                                </PhotoUpload>

                                <TouchableOpacity
                                    style={styles.uploadButton}
                                    onPress={() =>
                                        this.uploadPhoto(this.state.photo)
                                    }>
                                    <RegularText
                                        style={
                                            (styles.buttonText,
                                            {fontSize: 20, color: "gray"})
                                        }>
                                        Upload Photo
                                    </RegularText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <View
                    style={{
                        height: 0.08 * SCREEN_HEIGHT,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginBottom: 30,
                    }}>
                    <View style={{width: FORM_WIDTH}}>
                        <GradientButton
                            title="Next"
                            onPress={() => this.submit()}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    uploadButton: {
        height: 50,
        width: 200,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#D3D3D3",
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "400",
        color: "gray",
    },
    headerText: {
        fontSize: 25,
        color: "black",
        paddingLeft: 20,
    },
});
