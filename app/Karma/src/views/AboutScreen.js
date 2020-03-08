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
import PhotoUpload from "react-native-photo-upload";
import {RegularText, SubTitleText} from "../components/text";
import {RadioInput} from "../components/radio";

import PageHeader from "../components/PageHeader";
import {GradientButton} from "../components/buttons";
import Styles, {normalise} from "../styles/Styles";
import Colours from "../styles/Colours";

class AboutScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: null,
            gender: null,
            genderSelected: false,
            dateSelected: false,
            date: new Date(),
            minYear: new Date().getFullYear() - 18,
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    goToPrevious() {
        this.props.navigation.goBack();
    }

    goToNext() {
        if (this.state.genderSelected && this.state.dateSelected) {
            this.props.navigation.navigate("ContactInfo", {
                photo: this.state.photo,
                gender: this.state.gender,
                date: this.state.date,
            });
        } else if (this.state.genderSelected && !this.state.dateSelected) {
            this.setState({
                dateSelected: false,
            });
        } else if (!this.state.genderSelected && this.state.dateSelected) {
            this.setState({
                genderSelected: false,
            });
        } else {
            this.setState({
                genderSelected: false,
                dateSelected: false,
            });
        }
        !this.state.genderSelected &&
            Alert.alert("Error", "Please select a gender.");
        !this.state.dateSelected &&
            Alert.alert(
                "Error",
                "Please select a valid birthday. You must be 18 years or older to use Karma.",
            );
    }

    setGender(selectedGender) {
        this.setState({
            gender: selectedGender,
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
            this.setState({
                dateSelected: true,
            });
        } else {
            this.setState({
                dateSelected: false,
            });
        }
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
                                <RegularText style={Styles.pb8}>
                                    Charities need to know this information
                                    about volunteers.
                                </RegularText>
                            </View>

                            <View style={styles.header}>
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

                            <SubTitleText>When is your birthday?</SubTitleText>
                            <View style={{alignItems: "center"}}>
                                <DatePicker
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
