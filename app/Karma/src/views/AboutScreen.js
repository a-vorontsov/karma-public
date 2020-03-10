import React from "react";
import {
    View,
    Image,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView} from "react-native-gesture-handler";
import DatePicker from "react-native-date-picker";
import TextInput from "../components/TextInput";
import PhotoUpload from "react-native-photo-upload";
import {RegularText, SubTitleText} from "../components/text";
import {RadioInput} from "../components/radio";

import PageHeader from "../components/PageHeader";
import {GradientButton} from "../components/buttons";
import Styles, {normalise} from "../styles/Styles";
import Colours from "../styles/Colours";
const request = require("superagent");

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
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
    };

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

    setDate(selectedDate) {
        this.setState({date: selectedDate});
        if (selectedDate.getFullYear() <= this.state.minYear) {
            this.setState({dateSelected: true});
        } else {
            this.setState({dateSelected: false});
        }
    }

    createIndividual() {
        const individual = {
            userId: 1, // TODO
            firstName: this.state.fname,
            surName: this.state.lname,
            dateOfBirth: this.state.date,
            gender: this.state.gender,
            addressLine1: "TODO", // TODO
            addressLine2: "TODO", // TODO
            townCity: "TODO", // TODO
            countryState: "TODO", // TODO
            postCode: "TODO", // TODO
            phoneNumber: "213123421", // TODO
        };
        return individual;
    }

    goToPrevious() {
        this.props.navigation.goBack();
    }

    async goToNext() {
        const {gender, dateSelected, fname, lname} = this.state;
        !gender && Alert.alert("Error", "Please select a gender.");
        fname === "" && Alert.alert("Error", "Please input your first name.");
        lname === "" && Alert.alert("Error", "Please input your last name.");
        !dateSelected &&
            Alert.alert(
                "Error",
                "Please select a valid birthday. You must be 18 years or older to use Karma.",
            );

        const individual = this.createIndividual();
        await request
            .post("http://localhost:8000/register/individual")
            .send({
                authToken: "ffa234124",
                userId: "1",
                ...individual,
            })
            .then(res => {
                console.log(res.body);
                this.props.navigation.navigate("PickCauses", {
                    photo: this.state.photo,
                    gender: this.state.gender,
                    date: this.state.date,
                });
            })
            .catch(err => {
                Alert.alert("Server Error", err.message);
            });
    }

    render() {
        return (
            <SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView
                    style={Styles.ph24}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    enabled>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View>
                            <View>
                                <PageHeader title="About" />
                                <SubTitleText style={{fontSize: normalise(26)}}>
                                    Tell us about yourself
                                </SubTitleText>
                                <RegularText style={Styles.pb16}>
                                    Charities need to know this information
                                    about volunteers.
                                </RegularText>
                            </View>

                            <View style={[styles.header, {paddingRight:20}]}>
                                <PhotoUpload
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
                                            paddingVertical: 8,
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
                            <SubTitleText>What is your name?</SubTitleText>
                            <TextInput
                                placeholder="First Name"
                                name="fname"
                                onChange={this.onChangeText}
                                onSubmitEditing={() => this.lname.focus()}
                            />

                            <TextInput
                                inputRef={ref => (this.lname = ref)}
                                placeholder="Last Name"
                                name="lname"
                                onChange={this.onChangeText}
                                onSubmitEditing={() => this.dob.focus()}
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
                            <GradientButton
                                onPress={() => this.goToNext()}
                                title="Next"
                            />
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
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "400",
        color: "gray",
    },
});

export default AboutScreen;

// RESOURCES:
// https://facebook.github.io/react-native/docs/cameraroll.html
// https://www.npmjs.com/package/react-native-photo-upload
