import React from "react";
import {
    Dimensions,
    View,
    Image,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
    Keyboard,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView} from "react-native-gesture-handler";
import DatePicker from "react-native-date-picker";
import {TextInput} from "../components/input";
import {RegularText, SubTitleText} from "../components/text";
import {RadioInput} from "../components/radio";
import {REACT_APP_API_URL} from "react-native-dotenv";
import PageHeader from "../components/PageHeader";
import {GradientButton} from "../components/buttons";
import Styles, {normalise} from "../styles/Styles";
import Colours from "../styles/Colours";
import AddressInput from "../components/input/AddressInput";
import {getAuthToken} from "../util/credentials";
import AsyncStorage from "@react-native-community/async-storage";
import ImagePicker from "react-native-image-picker";
const request = require("superagent");
const {width} = Dimensions.get("window");

/**
 * @class AboutScreen represents the second screen in
 * the sign up process. This is the user equivalent of the
 * OrgSignUpScreen class. This is where the user chooses a
 * picture, name, and address for themselves.
 */
class AboutScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            lname: "",
            photo: null,
            gender: null,
            dateSelected: false,
            date: new Date(),
            minYear: new Date().getFullYear() - 18,
            addressLine1: "",
            addressLine2: "",
            townCity: "",
            countryState: "",
            postCode: "",
            firstOpen: true,
            submitting: false,
        };
    }

    /**
     * Pass up the states of the component object it is called on
     */
    onInputChange = inputState => {
        this.setState({
            addressLine1: inputState.address1,
            addressLine2: inputState.address2,
            townCity: inputState.city,
            countryState: inputState.region,
            postCode: inputState.postcode,
        });
    };

    /**
     * @override
     */
    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
    };

    clearFocus() {
        Keyboard.dismiss();
    }

    setGender(selectedGender) {
        const genderCharacter =
            selectedGender === "male"
                ? "m"
                : selectedGender === "female"
                ? "f"
                : "x";
        this.setState({
            gender: genderCharacter,
            genderSelected: true,
        });
    }

    /**
     * Open the photo library of the user
     */
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
    /**
     * Load the information for the text fields and photo
     */
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

    /**
     * Send the selected photo to the server
     * @param {*} selectedPhoto
     */
    async uploadPhoto(selectedPhoto) {
        const authToken = await getAuthToken();
        const endpointUsertype = "individual";

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
            )
                .then(res => {
                    const response = res.json();
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    setDate(selectedDate) {
        this.setState({date: selectedDate});
        if (selectedDate.getFullYear() <= this.state.minYear) {
            this.setState({dateSelected: true});
        } else {
            this.setState({dateSelected: false});
        }
    }
    /**
     * Get all the attributes needed for creating a user
     */

    createIndividual() {
        const individual = {
            firstName: this.state.fname,
            lastName: this.state.lname,
            dateOfBirth: this.state.date,
            gender: this.state.gender,
            phoneNumber: "213123421", // TODO
            address: {
                addressLine1: this.state.addressLine1,
                //use empty string for address line 2 if user does not use it
                addressLine2: this.state.addressLine2
                    ? this.state.addressLine2
                    : "",
                townCity: this.state.townCity,
                countryState: this.state.countryState,
                postCode: this.state.postCode,
            },
        };
        return individual;
    }

    goToPrevious() {
        this.props.navigation.goBack();
    }

    /**
     * Called when 'next' button is pressed
     * Send a POST request to the server sending the information the user filled in
     * Alert the user if any required fields were not completed
     */
    async goToNext() {
        const {
            gender,
            dateSelected,
            fname,
            lname,
            photo,
            addressLine1,
            townCity,
            countryState,
            postCode,
        } = this.state;

        if (fname === "" || lname === "") {
            this.setState({
                firstOpen: false,
            });
        }
        if (
            gender &&
            fname !== "" &&
            lname !== "" &&
            dateSelected &&
            addressLine1 &&
            townCity &&
            countryState &&
            postCode
        ) {
            const authToken = await getAuthToken();
            const individual = this.createIndividual();

            await request
                .post(`${REACT_APP_API_URL}/signup/individual`)
                .set("authorization", authToken)
                .send({
                    data: {individual: {...individual}},
                })
                .then(async res => {
                    console.log(res.body);
                    await this.uploadPhoto(photo);
                    await AsyncStorage.setItem("FULLY_SIGNED_UP", "1");
                    this.props.navigation.replace("PickCauses", {
                        isSignup: true,
                    });
                    return;
                })
                .catch(err => {
                    Alert.alert("Server Error", err.message);
                    this.setState({submitting: false});
                    return;
                });
        }
        !gender && Alert.alert("Error", "Please select a gender.");
        fname === "" && Alert.alert("Error", "Please input your first name.");
        lname === "" && Alert.alert("Error", "Please input your last name.");
        !dateSelected &&
            Alert.alert(
                "Error",
                "Please select a valid birthday. You must be 18 years or older to use Karma.",
            );
        this.setState({submitting: false});
    }

    render() {
        return (
            <SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView
                    style={Styles.ph24}
                    keyboardVerticalOffset={-90}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    enabled>
                    <PageHeader title="About" />
                    <ScrollView
                        style={{marginBottom: 100}}
                        keyboardShouldPersistTaps="handle"
                        showsVerticalScrollIndicator={false}>
                        <View>
                            <View>
                                <SubTitleText style={{fontSize: normalise(26)}}>
                                    Tell us about yourself
                                </SubTitleText>
                                <RegularText style={Styles.pb16}>
                                    Charities need to know this information
                                    about volunteers.
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
                                        style={
                                            (styles.buttonText,
                                            {fontSize: 20, color: "gray"})
                                        }>
                                        Choose Photo
                                    </RegularText>
                                </TouchableOpacity>
                            </View>
                            <SubTitleText>What is your name?</SubTitleText>
                            <TextInput
                                placeholder="First Name"
                                name="fname"
                                onChange={this.onChangeText}
                                onSubmitEditing={() => this.lname.focus()}
                                showError={
                                    this.state.firstOpen
                                        ? false
                                        : !this.state.fname
                                }
                            />

                            <TextInput
                                inputRef={ref => (this.lname = ref)}
                                placeholder="Last Name"
                                name="lname"
                                onChange={this.onChangeText}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                showError={
                                    this.state.firstOpen
                                        ? false
                                        : !this.state.lname
                                }
                            />

                            <SubTitleText>When is your birthday?</SubTitleText>
                            <View style={{alignItems: "center"}}>
                                <DatePicker
                                    name="dob"
                                    fadeToColor="none"
                                    mode="date"
                                    date={this.state.date}
                                    onDateChange={date => this.setDate(date)}
                                />
                            </View>

                            <SubTitleText>Choose your gender</SubTitleText>
                            <RadioInput
                                values={[
                                    {value: "male", title: "Male"},
                                    {value: "female", title: "Female"},
                                    {value: "non-binary", title: "Non-Binary"},
                                ]}
                                onValue={value => this.setGender(value)}
                            />

                            <SubTitleText>Where do you live?</SubTitleText>
                            <RegularText style={Styles.pb24}>
                                This is for us to help you find the most
                                compatible events with you. This information
                                will not be shared with charities.
                            </RegularText>
                            <AddressInput onChange={this.onInputChange} />
                            {!this.state.submitting && (
                                <GradientButton
                                    onPress={() => {
                                        this.setState({submitting: true});
                                        this.goToNext();
                                    }}
                                    title="Next"
                                />
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: width * 0.8,
        paddingLeft: 20,
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
        marginLeft: "auto",
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "400",
        color: Colours.lightGrey,
    },
});

export default AboutScreen;
