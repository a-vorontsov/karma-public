import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    StatusBar,
    Switch,
} from "react-native";
import Styles from "../styles/Styles";
import {hasNotch} from "react-native-device-info";
import PhotoUpload from "react-native-photo-upload";

import {
    RegularText,
    TitleText,
    SemiBoldText,
    LogoText,
    BoldText,
} from "../components/text";
import {GradientButton} from "../components/buttons";
import TextInput from "../components/TextInput";
import {ScrollView} from "react-native-gesture-handler";
import SignUpStyles from "../styles/SignUpStyles";
const {height: SCREEN_HEIGHT, width} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * width;

export default class CreateActivityScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAddressVisible: false,
            isWomenOnly: false,
            isIDReq: false,
            isPhysical: false,
            isAdditionalInfo: false,
        };
    }

    // toggleSwitch = value => {
    //     //onValueChange of the switch this function will be called
    //     this.setState({switchValue: value});
    //     //state changes according to switch
    //     //which will result in re-render the text
    // };

    render() {
        const {navigate} = this.props.navigation;

        return (
            <View style={Styles.container}>
                {/** HEADER */}
                <View
                    style={{
                        alignItems: "center",
                        height: 0.08 * SCREEN_HEIGHT,
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
                                    fontSize: 20,
                                    fontWeight: "500",
                                    color: "#3E3E3E",
                                    paddingLeft: 20,
                                    justifyContent: "center",
                                }}>
                                Create Activity
                            </RegularText>
                        </View>
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
                            <View
                                style={{width: FORM_WIDTH, paddingBottom: 20}}>
                                <RegularText>
                                    Lorem Ipsum dolor sit amet, conste ctetur
                                    adip isicing do eiut, sunt in culpa
                                </RegularText>
                            </View>
                            <View style={{width: 0.9 * FORM_WIDTH}}>
                                <Text>Hello</Text>
                                <View
                                    style={{
                                        flexDirection: "row",
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
                                        style={SignUpStyles.uploadButton}
                                        onPress={() =>
                                            this.uploadPhoto(this.state.photo)
                                        }>
                                        <RegularText
                                            style={
                                                (SignUpStyles.uploadButtonText,
                                                {fontSize: 20, color: "gray"})
                                            }>
                                            Upload Photo
                                        </RegularText>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TextInput placeholder="Date" />
                            <View style={{flexDirection: "row"}}>
                                <TextInput placeholder="Time" />
                                <TouchableOpacity
                                    style={{position: "absolute", right: 0}}>
                                    <Image
                                        style={{backgroundColor: "grey"}}
                                        source={require("../assets/images/general-logos/clock-logo.png")}
                                    />
                                </TouchableOpacity>
                            </View>

                            <TextInput placeholder="Slots" />
                            <View
                                style={{
                                    width: FORM_WIDTH,
                                    flexDirection: "row",
                                    alignItems: "flex-end",
                                    marginLeft: 0.9 * FORM_WIDTH,
                                }}>
                                <Text>Add another slot</Text>
                                <TouchableOpacity>
                                    <Image
                                        style={{height: 25, width: 25}}
                                        source={require("../assets/images/general-logos/photo-plus.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <RegularText>Address</RegularText>
                                <TextInput
                                    style={{fontSize: 10}}
                                    placeholder="Please leave this blank if you will be sending this via email once a volunteer has confirmed"
                                />
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <TextInput
                                    placeholder="Make address visible"
                                    editable={false}
                                />
                                <Switch
                                    style={{position: "absolute", right: 0}}
                                    onValueChange={() =>
                                        this.setState({
                                            isAddressVisible: !this.state
                                                .isAddressVisible,
                                        })
                                    }
                                    value={this.state.isAddressVisible}
                                />
                            </View>
                            <TextInput placeholder="What will volunteers do?" />
                            <TextInput placeholder="Who to contact" />
                            <View style={{width: FORM_WIDTH}}>
                                <SemiBoldText
                                    style={{alignItems: "flex-start"}}>
                                    Important
                                </SemiBoldText>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <TextInput
                                    placeholder="Women only event"
                                    editable={false}
                                />
                                <Switch
                                    style={{position: "absolute", right: 0}}
                                    onValueChange={() =>
                                        this.setState({
                                            isWomenOnly: !this.state
                                                .isWomenOnly,
                                        })
                                    }
                                    value={this.state.isWomenOnly}
                                />
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <TextInput
                                    placeholder="Photo ID required"
                                    editable={false}
                                />
                                <Switch
                                    style={{position: "absolute", right: 0}}
                                    onValueChange={() =>
                                        this.setState({
                                            isIDReq: !this.state.isIDReq,
                                        })
                                    }
                                    value={this.state.isIDReq}
                                />
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <TextInput
                                    placeholder="This is a physical activity"
                                    editable={false}
                                />
                                <Switch
                                    style={{position: "absolute", right: 0}}
                                    onValueChange={() =>
                                        this.setState({
                                            isPhysical: !this.state.isPhysical,
                                        })
                                    }
                                    value={this.state.isPhysical}
                                />
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <TextInput
                                    placeholder="Additional information will be provided by email"
                                    editable={false}
                                />
                                <Switch
                                    style={{position: "absolute", right: 0}}
                                    onValueChange={() =>
                                        this.setState({
                                            isAdditionalInfo: !this.state
                                                .isAdditionalInfo,
                                        })
                                    }
                                    value={this.state.isAdditionalInfo}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                {/** NEXT BUTTON */}
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
                            onPress={() => console.log("hi")}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
