import React, {Component} from "react";
import {View, StyleSheet, Alert, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView} from "react-native";
import Styles from "../styles/Styles";
import Colours from "../styles/Colours";
import {GradientButton} from "../components/buttons";
import {RegularText} from "../components/text";
import PageHeader from "../components/PageHeader";
import PhotoUpload from "react-native-photo-upload";
const {width, height: SCREEN_HEIGHT} = Dimensions.get("window");
const formWidth = 0.8 * width;


const icons = {
    passport: require("../assets/images/general-logos/passport-icon.png"),
};

class VerifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: null,
            photoUploaded: false,
            phoneEntered: false,
            isPressed: false,
        };
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

    goToPrevious() {
        this.props.navigation.goBack();
    }

    static navigationOptions = {headerShown: false};
    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                    <View style={[Styles.ph24]}>
                        <PageHeader title="Sign Up" onPress={this.goToPrevious()}/>
                    </View>
                    <View style={[Styles.ph24, {paddingVertical: 40, alignItems: "center",justifyContent:"center"}]}>
                        <Image 
                            source={icons.passport}
                            style={{flex: 7 / 8, height:formWidth, width: formWidth}}
                            resizeMode="contain"
                        />
                        <RegularText style={[Styles.pv16, {fontSize: 24, color: Colours.blue, fontWeight: "500"}]}>
                            Verify your account
                        </RegularText>
                            <View>
                                <RegularText style={[{fontSize: 18, textAlign: "center"}]}>
                                We need you to verify who you are for your safety and the safety of others.
                                </RegularText>
                                <RegularText style={[Styles.pv24, {fontSize: 18, textAlign: "center"}]}>
                                    Please upload a photo of your ID below to be verified.
                                </RegularText>
                            </View>
                            <View style={[styles.header, {paddingRight: 20}]}>
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
                                            width: 50,
                                            height: 50,
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

                <View
                    style={{
                        height: 0.08 * SCREEN_HEIGHT,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginBottom: 30,
                    }}>
                    <View style={{width: formWidth}}>
                        <GradientButton
                            title="Verify now"
                            onPress={() => this.props.navigation.navigate("Activities")}
                        />
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
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    text: {
        justifyContent: "center",
        textAlign: "center",
        color: Colours.black,
    },
    button: {
        alignItems: "center",
        backgroundColor: "transparent",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 30,
        paddingHorizontal: 125,
        paddingVertical: 10,
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
export default VerifyScreen;
