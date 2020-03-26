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
import Styles, {normalise} from "../styles/Styles";
import SignUpStyles from "../styles/SignUpStyles";
import {Dropdown} from "react-native-material-dropdown";
import PageHeader from "../components/PageHeader";
import DatePicker from "react-native-date-picker";
import AddressInput from "../components/input/AddressInput";
import Colours from "../styles/Colours";

import {RegularText, SubTitleText, BoldText} from "../components/text";
import CheckBox from "../components/CheckBox";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {TextInput} from "../components/input";
import {GradientButton} from "../components/buttons";
import {getAuthToken} from "../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";
const request = require("superagent");
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;
const TEXT_COLOUR = "#7F7F7F";

export default class OrgSignUpScreen extends React.Component {
    constructor(props) {
        console.disableYellowBox = true;
        super(props);

        this.state = {
            orgType: "NGO (Non-Government Organisation",
            orgName: "",
            charityNumber: "0",
            fname: "",
            lname: "",
            phone: "",
            regDate: "",
            isLowIncome: false,
            isExempt: false,
            photo: null,
            submitPressed: false,
            isRegDateVisible: false,
            addressLine1: "",
            addressLine2: "",
            townCity: "",
            countryState: "",
            postCode: "",
        };
    }

    showDatePicker = name => {
        console.log(name);
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

    onInputChange = inputState => {
        this.setState({
            addressLine1: inputState.address1,
            addressLine2: inputState.address2,
            townCity: inputState.city,
            countryState: inputState.region,
            postCode: inputState.postcode,
        });
    };

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
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

    createOrganisation() {
        const organisation = {
            name: this.state.orgName,
            organisationType: this.state.orgType,
            charityNumber: this.state.charityNumber,
            lowIncome: this.state.isLowIncome,
            exempt: this.state.isExempt,
            pocFirstName: this.state.fname,
            pocLastName: this.state.lname,
            address: {
                addressLine1: this.state.addressLine1,
                addressLine2: this.state.addressLine2,
                townCity: this.state.townCity,
                countryState: this.state.countryState,
                postCode: this.state.postCode,
            },
            phoneNumber: this.state.phone, //TODO
        };
        return organisation;
    }

    submit = async () => {
        const {navigate} = this.props.navigation;
        this.setState({submitPressed: true});
        if (!this.state.orgName || !this.state.phone) {
            return;
        }
        const authToken = await getAuthToken();

        const org = this.createOrganisation();

        await request
            .post(`${REACT_APP_API_URL}/signup/organisation`)
            .set("authorization", authToken)
            .send({
                data: {organisation: {...org}},
            })
            .then(res => {
                navigate("PickCauses");
            })
            .catch(err => {
                Alert.alert("Server Error", err.message);
            });
    };

    render() {
        const showDateError =
            this.state.submitPressed && this.state.regDate === "";

        const data = [
            {value: "NGO (Non-Government Organisation"},
            {value: "Non Profit Organisation"},
            {value: "Charity Option 2"},
        ];

        return (
            <View style={Styles.container}>
                {/** HEADER */}
                <View
                    style={{
                        alignItems: "center",
                        height: 0.08 * SCREEN_HEIGHT,
                        justifyContent: "flex-start",
                        marginTop: hasNotch() ? 40 : StatusBar.currentHeight,
                    }}>
                    <View style={{alignItems: "flex-start", width: FORM_WIDTH}}>
                        <PageHeader title="Sign Up" />
                    </View>
                </View>
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <SubTitleText
                            style={[
                                Styles.ph24,
                                {
                                    paddingLeft: 40,
                                    paddingVertical: -15,
                                    fontSize: normalise(26),
                                },
                            ]}>
                            Create a new account
                        </SubTitleText>
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
                                onSubmitEditing={() => this.password.focus()}
                                name="orgName"
                                showError={
                                    this.state.submitPressed
                                        ? !this.state.orgName
                                        : false
                                }
                            />
                            <TextInput
                                placeholder="Organisation Phone Number"
                                name="phone"
                                onChange={this.onChangeText}
                                onSubmitEditing={() => this.fname.focus()}
                            />
                            <TextInput
                                placeholder="Point of Contact First Name"
                                name="fname"
                                onChange={this.onChangeText}
                                onSubmitEditing={() => this.lname.focus()}
                                showError={
                                    this.state.submitPressed
                                        ? !this.state.fname
                                        : false
                                }
                            />

                            <TextInput
                                inputRef={ref => (this.lname = ref)}
                                placeholder="Point of Contact Last Name"
                                name="lname"
                                onChange={this.onChangeText}
                                showError={
                                    this.state.submitPressed
                                        ? !this.state.lname
                                        : false
                                }
                            />

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

                            {/* ADDRESS */}
                            <View>
                                <RegularText
                                    style={{
                                        color: Colours.blue,
                                        fontSize: 20,
                                        paddingVertical: 10,
                                    }}>
                                    What is your organisation's address?
                                </RegularText>
                                <AddressInput onChange={this.onInputChange} />
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
                                        paddingRight: 30,
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
