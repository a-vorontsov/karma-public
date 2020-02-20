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
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default class OrgSignUpScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orgType: "",
            orgName: "",
            charityNumber: "",
            regDate: "",
            email: "",
            password: "",
            confPassword: "",
            isLowIncome: false,
            isExempt: false,
            photo: null,
            submitPressed: false,
        };
    }

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

    render() {
        const showPasswordError =
            !this.state.password ||
            this.state.password !== this.state.confPassword ||
            !this.isValidPassword();
        const {navigate} = this.props.navigation;
        const data = [
            {value: "NGO (Non-Government Organisation"},
            {value: "Charity Option 1"},
            {value: "Charity Option 2"},
        ];

        return (
            <>
                <KeyboardAvoidingView
                    style={Styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    enabled>
                    {/** HEADER */}
                    <View style={{alignItems: "center", width: FORM_WIDTH}}>
                        {/* <View
                            style={{
                                alignItems: "flex-start",
                                backgroundColor: "white",
                                marginTop: hasNotch()
                                    ? 60
                                    : StatusBar.currentHeight,
                            }}>
                            <View style={{flexDirection: "row"}}>
                                <Text>🔙</Text>
                                <Text>Sign Up</Text>
                            </View>
                            <Text style={SignUpStyles.subheaderText}>
                                Create a new account
                            </Text>
                        </View> */}
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View
                            style={{
                                minHeight: SCREEN_HEIGHT,
                            }}>
                            {/** FORM INPUTS */}
                            <View
                                style={{
                                    flex: 1,
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
                                    placeholder="Charity or Organisation name"
                                    onSubmitEditing={() =>
                                        this.charityNumber.focus()
                                    }
                                />

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
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                />
                                <TextInput
                                    style={SignUpStyles.textInput}
                                    placeholder="Email"
                                    inputRef={ref => (this.charityNumber = ref)}
                                    onSubmitEditing={() => this.regDate.focus()}
                                />
                                <TextInput
                                    inputRef={ref => (this.regDate = ref)}
                                    style={SignUpStyles.textInput}
                                    placeholder="Password"
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                />

                                {/** EXEMPTION REASONS */}
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
                                                Your income is below £5,000 or
                                                are 'excepted'
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
                                                    isExempt: !this.state
                                                        .isExempt,
                                                })
                                            }
                                        />
                                        <Text
                                            style={{
                                                flexShrink: 1,
                                                color: TEXT_COLOUR,
                                            }}>
                                            You are exempt from regulation by
                                            the Charity Comission
                                        </Text>
                                    </View>
                                </View>
                                {/** LOGO UPLOAD */}

                                {/* <View style={{flexDirection: "row"}}> */}

                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}>
                                    <PhotoUpload
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
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {/** NEXT BUTTON */}
                <View
                    style={[
                        Styles.p16,
                        {
                            backgroundColor: "white",
                            width: SCREEN_WIDTH,
                            alignItems: "center",
                        },
                    ]}>
                    <View
                        style={[
                            {
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
            </>
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
