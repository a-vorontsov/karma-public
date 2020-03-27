import React, {Component} from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Platform,
} from "react-native";
import {RegularText} from "../components/text";
import {GradientButton, TransparentButton} from "../components/buttons";
import CauseItem from "../components/causes/CauseItem";
import ImagePicker from "react-native-image-picker";
import Styles from "../styles/Styles";
import CarouselStyles, {
    itemWidth2,
    sliderWidth,
} from "../styles/CarouselStyles";
import Carousel from "react-native-snap-carousel";
import ActivityCard from "../components/activities/ActivityCard";
import Colours from "../styles/Colours";
import CauseStyles from "../styles/CauseStyles";
import {getAuthToken} from "../util/credentials";
import {NavigationEvents} from "react-navigation";
import {REACT_APP_API_URL} from "react-native-dotenv";
const {width} = Dimensions.get("window");
const formWidth = 0.8 * width;
const HALF = formWidth / 2;
const icons = {
    share: require("../assets/images/general-logos/share-logo.png"),
    cog: require("../assets/images/general-logos/cog.png"),
    badge: require("../assets/images/general-logos/badges-logo.png"),
    edit_white: require("../assets/images/general-logos/edit-white.png"),
    photo_add: require("../assets/images/general-logos/photo-plus-background.png"),
    ribbon: require("../assets/images/general-logos/ribbon.png"),
    orange_circle: require("../assets/images/general-logos/orange-circle.png"),
    new_cause: require("../assets/images/general-logos/new_cause.png"),
};

const request = require("superagent");

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
            name: "",
            user: {},
            location: "",
            bio: "",
            causes: [],
            points: 1,
            createdEvents: [],
            createdPastEvents: [],
            upcomingEvents: [],
            pastEvents: [],
            eventsToggle: true,
            isOrganisation: false,
            organisationType: "",
            orgPhoneNumber: "",
            orgName: "",
            address: {},
            gender: null,

            photo: null,
        };
        this.fetchProfileInfo();
    }

    setupIndividualProfile(res) {
        const {
            causes,
            createdEvents,
            createdPastEvents,
            individual,
            pastEvents,
            upcomingEvents,
            user,
        } = res.body.data;
        this.setState({
            email: user.email,
            isOrganisation: false,
            firstName: individual.firstName,
            lastName: individual.lastName,
            user: user,
            location: individual.address.townCity,
            bio: individual.bio,
            causes: causes,
            points: individual.karmaPoints,
            upcomingEvents: upcomingEvents,
            pastEvents: pastEvents,
            createdEvents: createdEvents,
            createdPastEvents: createdPastEvents,
            address: individual.address,
            gender: individual.gender,
        });

        this.fetchProfilePicture();
    }

    setupOrganisationProfile(res) {
        const {
            causes,
            user,
            createdEvents,
            createdPastEvents,
            organisation,
        } = res.body.data;
        this.setState({
            email: user.email,
            isOrganisation: true,
            orgName: organisation.name,
            organisationType: organisation.organisationType,
            user: user,
            location:
                organisation.address.townCity +
                " " +
                organisation.address.postCode,
            causes: causes,
            bio: organisation.pocFirstName + " " + organisation.pocLastName,
            orgPhoneNumber: organisation.phoneNumber,
            upcomingEvents: createdEvents,
            pastEvents: createdPastEvents,
            address: organisation.address,
            pocFirstName: organisation.pocFirstName,
            pocLastName: organisation.pocLastName,
        });

        this.fetchProfilePicture();
    }

    componentDidMount() {
        const {navigation} = this.props;

        // this._unsubscribe = navigation.addListener("focus", () => {
        //     this.fetchProfileInfo();
        // });

        this.willFocusListener = navigation.addListener(
            "willFocus",
            async () => {
                await this.fetchProfileInfo();
            },
        );
    }

    componentWillUnmount() {
        this.willFocusListener.remove();
    }

    async fetchProfileInfo() {
        const authToken = await getAuthToken();

        request
            .get(`${REACT_APP_API_URL}/profile`)
            .set("authorization", authToken)
            .then(res => {
                console.log(res.body);
                res.body.data.organisation
                    ? this.setupOrganisationProfile(res)
                    : this.setupIndividualProfile(res);
            })
            .catch(err => {
                Alert.alert("Unable to load profile", err);
            });
    }

    fetchProfilePicture = async () => {
        const authToken = await getAuthToken();
        const endpointUsertype = this.state.isOrganisation
            ? "organisation"
            : "individual";

        request
            .get(`${REACT_APP_API_URL}/avatar/${endpointUsertype}`)
            .set("authorization", authToken)
            .then(res => {
                console.log(res.body);
                const imageLocation = res.body.picture_url;
                this.setState({photo: {uri: imageLocation}});
            })
            .catch(err => {
                console.log(err);
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

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                this.setState({photo: response});
                return this.handleUploadPhoto();
            }
        });
    };

    handleUploadPhoto = async () => {
        const authToken = await getAuthToken();
        const endpointUsertype = this.state.isOrganisation
            ? "organisation"
            : "individual";

        await fetch(`${REACT_APP_API_URL}/avatar/upload/${endpointUsertype}`, {
            method: "POST",
            headers: {
                authorization: authToken,
            },
            body: this.createFormData(this.state.photo, {}),
        })
            .then(res => {
                const response = res.json();
                if (res.status === 200) {
                    console.log(response.message);
                    Alert.alert("Success", "Profile picture updated!");
                } else {
                    Alert.alert("Upload Error", response.message);
                    this.setState({photo: null});
                }
            })
            .catch(error => {
                Alert.alert("Upload Error", error.message);
                this.setState({photo: null});
            });
        this.fetchProfileInfo();
    };

    _renderItem = ({item}) => {
        return (
            <View style={CarouselStyles.itemContainer2}>
                <View style={[CarouselStyles.item2, CarouselStyles.shadow]}>
                    <ActivityCard
                        activity={item}
                        signedup={false}
                        key={item.id}
                    />
                </View>
            </View>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {photo} = this.state;
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
                enabled>
                <NavigationEvents
                    onWillFocus={() => {
                        this.setState({photo: null});
                    }}
                />
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
                                onPress={() =>
                                    navigate("ProfileEdit", {
                                        profile: this.state,
                                    })
                                }>
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
                                onPress={() =>
                                    navigate("SettingsMenu", {
                                        user: this.state.user,
                                    })
                                }>
                                <Image
                                    onPress={() =>
                                        navigate("SettingsMenu", {
                                            user: this.state.user,
                                        })
                                    }
                                    source={icons.cog}
                                    style={{
                                        height: 25,
                                        width: 25,
                                        marginHorizontal: formWidth * 0.02,
                                        marginTop: 2,
                                        marginBottom: 5,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colours.blue,
                                height: HALF,
                                width: width,
                                alignItems: "center",
                                justifyContent: "flex-start",
                                paddingRight: 30,
                                paddingLeft: 30,
                                paddingBottom: 40,
                                flexDirection: "row",
                            }}>
                            <View>
                                <TouchableOpacity
                                    onPress={this.handleChoosePhoto}>
                                    <Image
                                        style={{
                                            paddingVertical: 5,
                                            width: HALF * 0.8,
                                            height: HALF * 0.8,
                                            borderRadius: 75,
                                        }}
                                        resizeMode="cover"
                                        source={photo ? photo : icons.photo_add}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    marginLeft: 38,
                                    flex: 1,
                                }}>
                                <View>
                                    {this.state.isOrganisation && (
                                        <Text
                                            numberOfLines={1}
                                            style={[styles.nameText]}>
                                            {this.state.orgName}
                                        </Text>
                                    )}
                                    {!this.state.isOrganisation && (
                                        <Text
                                            numberOfLines={1}
                                            style={[styles.nameText]}>
                                            {this.state.firstName}{" "}
                                            {this.state.lastName}
                                        </Text>
                                    )}
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.usernameText}>
                                        {this.state.user.username}
                                    </Text>
                                    {this.state.isOrganisation && (
                                        <Text
                                            numberOfLines={1}
                                            style={styles.usernameText}>
                                            {" | " +
                                                this.state.organisationType}
                                        </Text>
                                    )}
                                    {!this.state.isOrganisation && (
                                        <Text
                                            numberOfLines={1}
                                            style={styles.locationText}>
                                            {this.state.location}
                                        </Text>
                                    )}
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingTop: 20,
                                        justifyContent: "space-between",
                                    }}>
                                    {!this.state.isOrganisation && (
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
                                            <Image
                                                source={icons.orange_circle}
                                                style={{
                                                    height: 25,
                                                    width: 25,
                                                    left: 45,
                                                    top: -8,
                                                    position: "absolute",
                                                }}
                                            />
                                            <RegularText
                                                source={icons.orange_circle}
                                                style={{
                                                    color: Colours.white,
                                                    height: 25,
                                                    width: 25,
                                                    left: 53,
                                                    top: -5,
                                                    position: "absolute",
                                                }}>
                                                {this.state.points}
                                            </RegularText>
                                        </View>
                                    )}
                                    {this.state.isOrganisation && (
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                paddingTop: 20,
                                                justifyContent: "space-between",
                                            }}>
                                            <Text style={styles.usernameText}>
                                                {this.state.orgPhoneNumber}
                                            </Text>
                                        </View>
                                    )}
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
                                    onPress={() =>
                                        navigate("CreateActivity", {
                                            email: this.state.email,
                                        })
                                    }
                                    title="Create Activity"
                                    width={350}
                                />
                            </View>
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingTop: 15,
                                }}>
                                {this.state.isOrganisation && (
                                    <TransparentButton
                                        title="View Your Activities"
                                        size={15}
                                        ph={40}
                                        onPress={() =>
                                            navigate("CreatedActivities", {
                                                activities: this.state
                                                    .createdEvents,
                                                pastActivities: this.state
                                                    .createdPastEvents,
                                                creatorName: this.state.name,
                                                email: this.state.email,
                                            })
                                        }
                                    />
                                )}
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
                                    <View style={Styles.ph24}>
                                        <RegularText>
                                            {this.state.bio !== ""
                                                ? this.state.bio
                                                : "You do not have a bio. Please " +
                                                  "edit your profile to add one."}
                                        </RegularText>
                                    </View>
                                </View>
                                <RegularText style={styles.bioHeader}>
                                    Causes
                                </RegularText>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                    }}>
                                    {this.state.causes.length > 0 ? (
                                        <View style={CauseStyles.container}>
                                            {this.state.causes.map(cause => (
                                                <CauseItem
                                                    cause={cause}
                                                    key={cause.id}
                                                    isDisabled={true}
                                                />
                                            ))}
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigate("ProfileEdit", {
                                                    profile: this.state,
                                                })
                                            }>
                                            <Image
                                                source={icons.new_cause}
                                                style={{
                                                    height: width / 3.6,
                                                    width: width / 3.6,
                                                    borderRadius: 10,
                                                    marginVertical: 4,
                                                    paddingVertical: 16,
                                                    paddingHorizontal: 6,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor:
                                                        Colours.white,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    )}
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
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            eventsToggle: !this.state
                                                .eventsToggle,
                                        })
                                    }>
                                    <RegularText
                                        style={
                                            this.state.eventsToggle
                                                ? styles.bioHeader
                                                : styles.bioHeaderAlt
                                        }>
                                        {this.state.upcomingEvents.length > 0
                                            ? "Upcoming Events"
                                            : "No Upcoming Events"}
                                    </RegularText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            eventsToggle: !this.state
                                                .eventsToggle,
                                        })
                                    }
                                    style={{
                                        alignSelf: "flex-start",
                                        marginLeft: 80,
                                    }}>
                                    <RegularText
                                        style={
                                            this.state.eventsToggle
                                                ? styles.bioHeaderAlt
                                                : styles.bioHeader
                                        }>
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
                                    data={
                                        this.state.eventsToggle
                                            ? this.state.upcomingEvents
                                            : this.state.pastEvents
                                    }
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
        fontSize: 25,
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
