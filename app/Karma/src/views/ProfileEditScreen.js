import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Switch
} from "react-native";
import Slider from '@react-native-community/slider';
import {
    RegularText,
} from "../components/text";
import {GradientButton} from "../components/buttons";
import PhotoUpload from "react-native-photo-upload";
import Styles from "../styles/Styles";
import TextInput from "../components/TextInput";

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;
const icons = {
    share: require("../assets/images/general-logos/share-logo.png"),
    badge: require("../assets/images/general-logos/badges-logo.png"),
    edit_white: require("../assets/images/general-logos/edit-white.png"),
    calendar: require("../assets/images/general-logos/calendar-dark.png"),
    photo_add: require("../assets/images/general-logos/photo-plus-background.png"),
    new_cause: require("../assets/images/general-logos/new_cause.png"),
    ribbon: require("../assets/images/general-logos/k-ribbon.png"),
};

class ProfileEditScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            womenOnlyValue: true,
            distance: 90,
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
                enabled>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#00A8A6",
                            height: 45,
                            width: width,
                            flexDirection: "row",
                        }}
                    />
                    <SafeAreaView style={Styles.safeAreaContainer}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "#00A8A6",
                                width: width,
                                justifyContent: "flex-start",
                                flexDirection: "row-reverse",
                            }}>
                                <TouchableOpacity>
                                    <Image
                                        source={icons.edit_white}
                                        style={{height: 25, width: 25, marginHorizontal: formWidth*0.05, marginTop:2}}
                                    />
                                </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "#00A8A6",
                                height: 160,
                                width: width,
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingRight: 30,
                                paddingBottom: 40,
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
                                        paddingVertical: 5,
                                        width: 140,
                                        height: 140,
                                        borderRadius: 75,
                                    }}
                                    resizeMode="cover"
                                    source={icons.photo_add}
                                />
                            </PhotoUpload>
                            <View>
                                <RegularText style={styles.nameText}>
                                    EDIT
                                </RegularText>
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}>
                                    <Text style={styles.usernameText}>
                                        Username
                                    </Text>
                                    <Text style={styles.locationText}>
                                        Location
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingTop: 20,
                                        justifyContent: "space-between",
                                    }}>
                                        <View style={styles.pointContainer}>
                                            <Image
                                            source={icons.badge}
                                            style={{height: 60, width: 60}}
                                            /> 
                                            <Image
                                            source={icons.ribbon}
                                            style={{height: 60, width: 60, position: "absolute"}}
                                            /> 
                                        </View>
                                        <TouchableOpacity>
                                            <Image
                                                source={icons.share}
                                                style={{height: 25, width: 25, resizeMode:"contain"}}
                                            />
                                        </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 5,
                                backgroundColor: "white",
                                paddingVertical: 25,
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: formWidth*0.075,
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}>
                                    <RegularText style={styles.bioHeader}>
                                        Activity
                                    </RegularText>
                                </View>
                                <View style={styles.editContainer}>
                                    <RegularText style={styles.contentText}>
                                        Availability:
                                    </RegularText>
                                    <View style={styles.leftItem}>
                                        <TouchableOpacity>
                                        <Image
                                            source={icons.calendar}
                                            style={{width:25, height:25, resizeMode:"contain"}}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{flex: 1, flexDirection: "column"}}>
                                    <View style={{flex: 1, flexDirection: "row"}}>
                                        <RegularText style={styles.contentText}>
                                            Distance
                                        </RegularText>
                                        <View style={styles.leftItem}>
                                            <RegularText style={styles.contentText}>
                                                {this.state.distance} Miles
                                            </RegularText>
                                        </View>
                                    </View>
                                    <Slider
                                        style={styles.slider}
                                        value = {this.state.distance}
                                        minimumValue={0}
                                        maximumValue={100}
                                        step={1}
                                        thumbTintColor = "#00A8A6"
                                        minimumTrackTintColor= "#A9DCDF"
                                        onSlidingComplete={val => this.setState({ distance: val })}
                                    />
                                </View>
                                <View style={styles.editContainer}>
                                    <RegularText style={styles.contentText}>
                                        Women Only Activities:
                                    </RegularText>
                                    <View style={styles.leftItem}>
                                        <Switch
                                            style={styles.switch}
                                            value = {this.state.womenOnlyValue}
                                            trackColor={{true: '#A9DCDF', false: 'grey'}}
                                            thumbColor = "grey"
                                            onChange={val => this.setState({ womenOnlyValue: val })} />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                    }}>
                                    <RegularText style={styles.bioHeader}>
                                        Bio
                                    </RegularText>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "center",
                                    }}>
                                    <TextInput>
                                        
                                    </TextInput>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-end",
                                    }}>
                                    <RegularText style={styles.bioHeader}>
                                        Causes
                                    </RegularText>
                                    <TouchableOpacity>
                                        <Image 
                                            source={icons.new_cause}
                                            style={{width:60, height:60, resizeMode:"contain"}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 5,
                                backgroundColor: "white",
                                paddingVertical: 25,
                            }}>
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <GradientButton
                                    onPress={() => navigate("Profile")}
                                    title="Update"
                                    width={350}
                                />
                            </View>
                            </View>
                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    slider: {
        width: formWidth+(formWidth*0.1),
        height:15
    },
    switch: {
        alignSelf: "flex-start",
        marginTop:5,
        transform:[{ scaleX: .8 }, { scaleY: .8 }] 
    },
    nameText: {
        fontSize: 30,
        color: "white",
        fontWeight: "bold",
    },
    usernameText: {
        fontSize: 20,
        color: "white",
    },
    locationText: {
        fontSize: 20,
        color: "#75C4C3",
        paddingLeft: 10,
    },
    bioHeader: {
        paddingTop: 25,
        fontSize: 20,
        color: "black",
        fontWeight: "500",
    },
    bioHeaderAlt: {
        paddingTop: 25,
        fontSize: 18,
        color: "#00A8A6",
        fontWeight: "500",
        marginLeft: 80
    },
    contentText: {
        fontSize: 18,
        color: "grey",
        paddingVertical: 20,
    },
    answerText: {
        fontSize: 15,
        color: "#00A8A6",
        paddingVertical: 5,
        paddingLeft: 5,
    },
    editContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderColor: "transparent",
        borderBottomColor: "#D3D3D3",
        borderWidth: 1.5,
    },
    pointContainer:{
        flex: 1,
    },
    leftItem:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    }
});

export default ProfileEditScreen;
