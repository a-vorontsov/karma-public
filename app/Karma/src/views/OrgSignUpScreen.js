import React from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    StatusBar,
    Image,
    Alert,
    StyleSheet,
} from "react-native";
import PhotoUpload from "react-native-photo-upload";
import {hasNotch} from "react-native-device-info";
import Styles from "../styles/Styles";
import SignUpStyles from "../styles/SignUpStyles";
import {Dropdown} from "react-native-material-dropdown";
import PageHeader from "../components/PageHeader";
import DatePicker from "react-native-date-picker";

import {RegularText, SemiBoldText, BoldText} from "../components/text";
import CheckBox from "../components/CheckBox";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import TextInput from "../components/TextInput";
import {GradientButton} from "../components/buttons";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;
const TEXT_COLOUR = "#7F7F7F";
//at least 8 characters with one upper, lower and a digit
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
            isRegDateVisible: false,
        };
    }

    showDatePicker = name => {
        this.setState({
            [name]: !this.state[name],
        });
    };

    setDateValue = (date, name) => {
        if (date > new Date()) {
        }
        //removes day and local timezone from date
        let formattedString = date.toUTCString().substring(5);
        formattedString = formattedString.slice(0, -13);
        this.setState({
            [name]: formattedString,
        });
    };

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
    };

    isValidPassword = () => {
        return PASSWORD_REGEX.test(this.state.password);
    };

    setPhoto(selectedPhoto) {
        this.setState({
            photo: selectedPhoto,
        });
    }

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

    render() {
        const passwordError = this.getPasswordError();

        const showPasswordError =
            !this.state.password ||
            this.state.password !== this.state.confPassword ||
            !this.isValidPassword();

        const showDateError =
            this.state.submitPressed &&
            (!this.state.isExempt && !this.state.isLowIncome);

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
                        marginTop: hasNotch() ? 40 : StatusBar.currentHeight,
                    }}>
                    <View style={{alignItems: "flex-start", width: FORM_WIDTH}}>
                        <PageHeader title="Sign Up" />

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
                            </View>
                            {/** DATE INPUT */}
                            <View>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.showDatePicker("isRegDateVisible")
                                    }
                                    style={{
                                        backgroundColor: "#f8f8f8",
                                        zIndex: 50,
                                    }}>
                                    <View style={{flexDirection: "row"}}>
                                        <TextInput
                                            pointerEvents="none"
                                            placeholder="Date of registration"
                                            editable={false}
                                            showError={showDateError}
                                            value={this.state.regDate}
                                        />
                                        <Image
                                            style={{
                                                position: "absolute",
                                                right: 0,
                                                top: 20,
                                                height: 20,
                                                width: 20,
                                            }}
                                            source={require("../assets/images/general-logos/calendar-dark.png")}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {this.state.isRegDateVisible && (
                                <View>
                                    <DatePicker
                                        mode="date"
                                        onDateChange={date =>
                                            this.setDateValue(date, "regDate")
                                        }
                                        locale="en_GB"
                                        maximumDate={new Date()}
                                    />
                                </View>
                            )}
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
                                    style={[
                                        SignUpStyles.text,
                                        {fontSize: 20, marginBottom: 5},
                                    ]}>
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
                                            );
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
