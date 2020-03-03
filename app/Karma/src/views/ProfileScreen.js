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
} from "react-native";
import {RegularText} from "../components/text";
import {GradientButton} from "../components/buttons";
import PhotoUpload from "react-native-photo-upload";
import Styles from "../styles/Styles";
import CarouselStyles, {
    itemWidth2,
    sliderWidth,
} from "../styles/CarouselStyles";
import Carousel from "react-native-snap-carousel";
import ActivityCard from "../components/ActivityCard";
import Colours from "../styles/Colours";

const carouselEntries = [{individual: true}, {individual: false}];
const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;
const icons = {
    share: require("../assets/images/general-logos/share-logo.png"),
    cog: require("../assets/images/general-logos/cog.png"),
    badge: require("../assets/images/general-logos/badges-logo.png"),
    edit_white: require("../assets/images/general-logos/edit-white.png"),
    edit_grey: require("../assets/images/general-logos/edit-grey.png"),
    photo_add: require("../assets/images/general-logos/photo-plus-background.png"),
    ribbon: require("../assets/images/general-logos/k-ribbon.png"),
};

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    _renderItem = ({item}) => {
        return (
            <View style={CarouselStyles.itemContainer2}>
                <View style={[CarouselStyles.item2, CarouselStyles.shadow]}>
                    <ActivityCard
                        individual={item.individual}
                        signedup={false}
                    />
                </View>
            </View>
        );
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
                            width: width,
                            flexDirection: "row",
                        }}
                    />
                    <SafeAreaView style={Styles.safeAreaContainer}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colours.blue,
                                width: width,
                                justifyContent: "flex-start",
                                flexDirection: "row-reverse",
                            }}>
                            <TouchableOpacity
                                onPress={() => navigate("ProfileEdit")}>
                                <Image
                                    source={icons.edit_white}
                                    style={{
                                        height: 25,
                                        width: 25,
                                        marginHorizontal: formWidth * 0.05,
                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigate("SettingsMenu")}>
                                <Image
                                    onPress={() => navigate("Settings")}
                                    source={icons.cog}
                                    style={{
                                        height: 25,
                                        width: 25,
                                        marginHorizontal: formWidth * 0.02,
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
                                    Name
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
                                            style={{
                                                height: 60,
                                                width: 60,
                                                position: "absolute",
                                            }}
                                        />
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
                                backgroundColor: "white",
                                paddingVertical: 25,
                            }}>
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <GradientButton
                                    title="Create Activity"
                                    width={350}
                                />
                            </View>
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
                                    <View style={styles.editContainer}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigate("ProfileEdit")
                                            }>
                                            <Image
                                                source={icons.edit_grey}
                                                style={styles.edit}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{flex: 1, flexDirection: "row"}}>
                                    <RegularText style={styles.contentText}>
                                        Availability:
                                    </RegularText>
                                    <RegularText style={styles.answerText}>
                                        DATES
                                    </RegularText>
                                </View>
                                <View style={{flex: 1, flexDirection: "row"}}>
                                    <RegularText style={styles.contentText}>
                                        Activity Date:
                                    </RegularText>
                                    <RegularText style={styles.answerText}>
                                        DATES
                                    </RegularText>
                                </View>
                                <View style={{flex: 1, flexDirection: "row"}}>
                                    <RegularText style={styles.contentText}>
                                        Women Only:
                                    </RegularText>
                                    <RegularText style={styles.answerText}>
                                        Y/N
                                    </RegularText>
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
                                    <View style={styles.editContainer}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigate("ProfileEdit")
                                            }>
                                            <Image
                                                source={icons.edit_grey}
                                                style={styles.edit}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "center",
                                    }}>
                                    <RegularText style={styles.contentText}>
                                        o eos et accusamus et iusto odio
                                        dignissimos ducimus qui blanditiis
                                        praesentium voluptatum deleniti atque
                                        corrupti quos dolores et quas molestias
                                        excepturi sint occaecati cupiditate non
                                        provident, similique sunt in culpa qui
                                        officia deserunt mollitia animi, id est
                                        laborum et dolorum fuga
                                    </RegularText>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                    }}>
                                    <RegularText style={styles.bioHeader}>
                                        Causes
                                    </RegularText>
                                    <View style={styles.editContainer}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigate("ProfileEdit")
                                            }>
                                            <Image
                                                source={icons.edit_grey}
                                                style={styles.edit}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                            }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingHorizontal: formWidth * 0.075,
                                }}>
                                <TouchableOpacity>
                                    <RegularText style={styles.bioHeader}>
                                        Upcoming Events
                                    </RegularText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{alignSelf:"flex-start", marginLeft:80}}>
                                    <RegularText style={styles.bioHeaderAlt}>
                                        Past Events
                                    </RegularText>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                }}>
                                <Carousel
                                    ref={c => {
                                        this._carousel = c;
                                    }}
                                    data={carouselEntries}
                                    removeClippedSubviews={false}
                                    renderItem={this._renderItem}
                                    sliderWidth={sliderWidth}
                                    itemWidth={itemWidth2}
                                    inactiveSlideOpacity={1}
                                    inactiveSlideScale={1}
                                    containerCustomStyle={CarouselStyles.slider}
                                    onSnapToItem={index =>
                                        this.setState({activeSlide: index})
                                    }
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
    },
    contentText: {
        fontSize: 15,
        color: Colours.black,
        paddingVertical: 5,
    },
    answerText: {
        fontSize: 15,
        color: Colours.blue,
        paddingVertical: 5,
        paddingLeft: 5,
    },
    editContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    edit: {
        height: 25,
        width: 25,
        alignSelf: "center",
        resizeMode: "contain",
    },
    pointContainer: {
        flex: 1,
    },
});

export default ProfileScreen;
