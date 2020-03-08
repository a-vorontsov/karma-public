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
    Switch,
} from "react-native";
import Slider from "@react-native-community/slider";
import {RegularText} from "../components/text";
import {GradientButton} from "../components/buttons";
import PhotoUpload from "react-native-photo-upload";
import Styles from "../styles/Styles";
import TextInput from "../components/TextInput";
import EditableText from "../components/EditableText";
import Colours from "../styles/Colours";

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get("window");
const formWidth = 0.8 * SCREEN_WIDTH;
const HALF = formWidth/2;
const icons = {
    share: require("../assets/images/general-logos/share-logo.png"),
    edit_white: require("../assets/images/general-logos/edit-white.png"),
    calendar: require("../assets/images/general-logos/calendar-dark.png"),
    photo_add: require("../assets/images/general-logos/photo-plus-background.png"),
    new_cause: require("../assets/images/general-logos/new_cause.png"),
    ribbon: require("../assets/images/general-logos/ribbon.png"),
    orange_circle: require("../assets/images/general-logos/orange-circle.png")
};

class ProfileEditScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            womenOnlyValue: false,
            distance: 90,
            name: "Edit",
            username: "Username",
            location: "Location",
            bio: "this is your bio lorem ipsum and such",
            causes: ["Cause1", "Cause2"],
            points: 1
        };
        this.onChangeText = this.onChangeText.bind(this);
    }

    static navigationOptions = {
        headerShown: false,
    };

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
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
                            backgroundColor: Colours.blue,
                            height: 45,
                            width: SCREEN_WIDTH,
                            flexDirection: "row",
                        }}
                    />
                    <SafeAreaView style={Styles.safeAreaContainer}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colours.blue,
                                width: SCREEN_WIDTH,
                                justifyContent: "flex-start",
                                flexDirection: "row-reverse",
                            }}>
                            <TouchableOpacity>
                                <Image
                                    source={icons.edit_white}
                                    style={{
                                        height: 25,
                                        width: 25,
                                        marginHorizontal: formWidth * 0.05,
                                        marginTop: 2,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colours.blue,
                                height: 160,
                                width: SCREEN_WIDTH,
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
                                <View style={{width: HALF}}>
                                    <EditableText 
                                        text={this.state.name} 
                                        style={[styles.nameText, {position:"absolute", top: -35}]} 
                                        onChange={val => this.setState({ name: val })}/>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}>
                                    <EditableText 
                                        text={this.state.username} 
                                        style={styles.usernameText} 
                                        onChange={val => this.setState({ username: val })}/>
                                    <EditableText 
                                        text={this.state.location} 
                                        style={styles.locationText} 
                                        onChange={val => this.setState({ location: val })}/>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingTop: 20,
                                        justifyContent: "space-between",
                                    }}>
                                    <View style={[styles.pointContainer]}>
                                        <Image
                                            source={icons.ribbon}
                                            style={{
                                                height: 60,
                                                width: 60,
                                                position: "absolute",
                                            }}
                                        />
                                        <Image
                                            source={icons.orange_circle}
                                            style={{height: 25, width: 25, left: 45, top: -8, position:"absolute"}}
                                        />
                                        <RegularText
                                            source={icons.orange_circle}
                                            style={{color: Colours.white, height: 25, width: 25, left: 53, top: -5, position:"absolute"}}
                                        >{this.state.points}</RegularText>
                                    </View>
                                    <TouchableOpacity>
                                        <Image
                                            source={icons.share}
                                            style={{
                                                height: 25,
                                                width: 25,
                                                resizeMode: "contain",
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 5,
                                backgroundColor: Colours.white,
                                paddingVertical: 25,
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: formWidth * 0.075,
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
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    resizeMode: "contain",
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View
                                    style={{flex: 1, flexDirection: "column"}}>
                                    <View
                                        style={{flex: 1, flexDirection: "row"}}>
                                        <RegularText style={styles.contentText}>
                                            Distance
                                        </RegularText>
                                        <View style={styles.leftItem}>
                                            <RegularText
                                                style={styles.contentText}>
                                                {this.state.distance} Miles
                                            </RegularText>
                                        </View>
                                    </View>
                                    <Slider
                                        style={styles.slider}
                                        value={this.state.distance}
                                        minimumValue={0}
                                        maximumValue={100}
                                        step={1}
                                        thumbTintColor={Colours.blue}
                                        minimumTrackTintColor="#A9DCDF"
                                        onSlidingComplete={val =>
                                            this.setState({distance: val})
                                        }
                                    />
                                </View>
                                <View style={styles.editContainer}>
                                    <RegularText style={styles.contentText}>
                                        Women Only Activities:
                                    </RegularText>
                                    <View style={styles.leftItem}>
                                        <Switch
                                            style={styles.switch}
                                            value={this.state.womenOnlyValue}
                                            trackColor={{
                                                true: "#A9DCDF",
                                                false: Colours.grey,
                                            }}
                                            thumbColor={Colours.grey}
                                            onChange={prevState =>
                                                this.setState({
                                                    womenOnlyValue: !prevState.womenOnlyValue,
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                                <RegularText style={styles.bioHeader}>
                                    Bio
                                </RegularText>
                                <View style={{flexWrap: "wrap"}}>
                                    <EditableText 
                                        text={this.state.bio} 
                                        style={styles.contentText} 
                                        onChange={val => this.setState({ bio: val })}/>
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
                                            style={{
                                                width: 60,
                                                height: 60,
                                                resizeMode: "contain",
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                height: 0.08 * SCREEN_HEIGHT,
                                justifyContent: "flex-end",
                                alignItems: "center",
                                marginBottom: 30,
                                backgroundColor: Colours.white,
                            }}>
                            <View style={{width: formWidth}}>
                                <GradientButton 
                                    onPress={() => navigate("Profile")}
                                    title="Update" />
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
        width: formWidth + formWidth * 0.1,
        height: 15,
    },
    switch: {
        alignSelf: "flex-start",
        marginTop: 5,
        transform: [{scaleX: 0.8}, {scaleY: 0.8}],
    },
    nameText: {
        fontSize: 30,
        color: Colours.white,
        fontWeight: "bold",
    },
    usernameText: {
        fontSize: 20,
        color: Colours.white,
    },
    locationText: {
        fontSize: 20,
        color: "#75C4C3",
        paddingLeft: 10,
    },
    bioHeader: {
        paddingTop: 25,
        fontSize: 20,
        color: Colours.black,
        fontWeight: "500",
    },
    bioHeaderAlt: {
        paddingTop: 25,
        fontSize: 18,
        color: Colours.blue,
        fontWeight: "500",
        marginLeft: 80,
    },
    contentText: {
        fontSize: 18,
        color: Colours.grey,
        paddingVertical: 20,
    },
    editContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        borderColor: "transparent",
        borderBottomColor: Colours.lightGrey,
        borderWidth: 1.5,
    },
    pointContainer: {
        flex: 1,
    },
    leftItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
});

export default ProfileEditScreen;
