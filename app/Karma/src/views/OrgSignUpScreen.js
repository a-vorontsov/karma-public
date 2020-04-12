import React from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Image,
    Alert,
    StyleSheet,
    Keyboard,
} from "react-native";
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
import ImagePicker from "react-native-image-picker";
import {SafeAreaView} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-community/async-storage";
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
            submitted: false,
            isRegDateVisible: false,
            addressLine1: "",
            addressLine2: "",
            townCity: "",
            countryState: "",
            postCode: "",
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

    choosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                this.setState({photo: response});
            }
        });
    };

    createFormData = (photo, body) => {
        const data = new FormData();

        data.append(
            "picture",
            {
                name: `fileupload_${new Date().getTime().toString()}`,
                type: photo.type,
                uri:
                    Platform.OS === "android"
                        ? photo.uri
                        : photo.uri.replace("file://", ""),
            },
            photo.fileName,
        );

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });

        return data;
    };

    async uploadPhoto(selectedPhoto) {
        const authToken = await getAuthToken();
        const endpointUsertype = "organisation";

        if (selectedPhoto != null) {
            await fetch(
                `${REACT_APP_API_URL}/avatar/upload/${endpointUsertype}`,
                {
                    method: "POST",
                    headers: {
                        authorization: authToken,
                    },
                    body: this.createFormData(selectedPhoto, {}),
                },
            ).catch(error => {
                console.log(error);
            });
        }
    }

    createOrganisation() {
        const organisation = {
            name: this.state.orgName,
            organisationType: this.state.orgType,
            organisationNumber: this.state.charityNumber,
            lowIncome: this.state.isLowIncome,
            exempt: this.state.isExempt,
            pocFirstName: this.state.fname,
            pocLastName: this.state.lname,
            address: {
                addressLine1: this.state.addressLine1,
                //use empty string for address line 2 if user does not use it
                addressLine2: this.state.addressLine2 || "",
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
        if (
            !this.state.orgName ||
            !this.state.phone ||
            !this.state.addressLine1 ||
            !this.state.postCode ||
            !this.state.townCity ||
            !this.state.countryState
        ) {
            this.setState({submitted: false});
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
            .then(async res => {
                await this.uploadPhoto(this.state.photo);
                await AsyncStorage.setItem("FULLY_SIGNED_UP", "1");
                navigate("Activities");
            })
            .catch(err => {
                Alert.alert("Server Error", err.message);
            });
        this.setState({submitted: false});
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
            <SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="never">
                        {/** HEADER */}
                        <View
                            style={{
                                alignItems: "center",
                                height: 0.08 * SCREEN_HEIGHT,
                                justifyContent: "flex-start",
                            }}>
                            <View
                                style={{
                                    alignItems: "flex-start",
                                    width: FORM_WIDTH,
                                }}>
                                <PageHeader title="Sign Up" />
                            </View>
                        </View>
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
                                onSubmitEditing={() => this.phone.focus()}
                                name="orgName"
                                showError={
                                    this.state.submitPressed
                                        ? !this.state.orgName
                                        : false
                                }
                            />
                            <TextInput
                                inputRef={ref => (this.phone = ref)}
                                placeholder="Organisation Phone Number"
                                name="phone"
                                onChange={this.onChangeText}
                                onSubmitEditing={() => this.fname.focus()}
                            />
                            <TextInput
                                inputRef={ref => (this.fname = ref)}
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
                                onSubmitEditing={() => Keyboard.dismiss()}
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
                                <View style={{alignSelf: "center"}}>
                                    <AddressInput
                                        onChange={this.onInputChange}
                                    />
                                </View>
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
                            <View style={styles.header}>
                                <TouchableOpacity onPress={this.choosePhoto}>
                                    <Image
                                        style={{
                                            paddingVertical: 8,
                                            width: 50,
                                            height: 50,
                                            borderRadius: 75,
                                        }}
                                        resizeMode="cover"
                                        source={
                                            this.state.photo
                                                ? this.state.photo
                                                : require("../assets/images/general-logos/photo-logo.png")
                                        }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.uploadButton}
                                    onPress={this.choosePhoto}>
                                    <RegularText
                                        style={{
                                            ...styles.buttonText,
                                            fontSize: 20,
                                            color: "gray",
                                        }}>
                                        Choose Photo
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
                        {!this.state.submitted && (
                            <GradientButton
                                title="Next"
                                onPress={() => {
                                    this.setState({submitted: true});
                                    this.submit();
                                }}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: FORM_WIDTH,
        paddingLeft: 10,
        marginLeft: 5,
    },
    uploadButton: {
        height: 50,
        width: 200,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: Colours.lightGrey,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: FORM_WIDTH / 6,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "400",
        color: Colours.lightGrey,
    },
    headerText: {
        fontSize: 25,
        color: "black",
        paddingLeft: 20,
    },
});
