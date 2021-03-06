import React, {Component} from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";
import Colours from "../../styles/Colours";
import PageHeader from "../../components/PageHeader";
import {GradientButton} from "../../components/buttons";
import ProgressBar from "../../components/ProgressBar";
import Communications from "react-native-communications";
import {getDate, formatAMPM, getMonthName} from "../../util/DateTimeInfo";
import MapView from "react-native-maps";
import BottomModal from "../../components/BottomModal";
import SignUpActivity from "../../components/activities/SignUpActivity";
import {getAuthToken} from "../../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";
import request from "superagent";
import {SafeAreaView} from "react-native-safe-area-context";
import ShareActivity from "../../components/sharing/ShareActivity";
import CauseStyles from "../../styles/CauseStyles";
import CauseItem from "../../components/causes/CauseItem";

const {height: SCREEN_HEIGHT, width} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * width;
const HALF = FORM_WIDTH / 2;

const icons = {
    share: require("../../assets/images/general-logos/export-logo.png"),
    profile: require("../../assets/images/general-logos/globe.png"),
    fave_inactive: require("../../assets/images/general-logos/fav-outline-profile.png"),
    fave_active: require("../../assets/images/general-logos/heart-red.png"),
    grey_circle: require("../../assets/images/general-logos/circle-grey.png"),
    calendar: require("../../assets/images/general-logos/calendar-light.png"),
    location: require("../../assets/images/general-logos/location-logo.png"),
    date: require("../../assets/images/general-logos/rectangle-blue.png"),
};

class ActivityInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sharing: false,
            displaySignupModal: false,
            signedUp: false,
            isOrganisation: false,
            showCancel: false,
            addInfo: false,
            photoId: false,
            physical: false,
            womenOnly: false,
            spots_taken: 3,
            causes: [],
            spots: 4,
            activity_name: "",
            org_name: "",
            location: "",
            full_date: "",
            full_time: "",
            full_location: "",
            favourited: false,
            addressVisible: true,
            lat: 37.78825,
            long: -122.4324,
            description: "",
            contact: "",
            where: "",
            important: "",
        };
        this.state.signedUp = this.props.navigation.getParam("signedup");
        this.state.isOrganisation = this.props.navigation.getParam(
            "isOrganisation",
        );
    }

    async componentDidMount() {
        const activity = this.props.navigation.getParam("activity");

        this.getEventInfo(activity);

        !this.state.isOrganisation && (await this.getSignUpStatus());
        await this.getCreatorInfo(
            activity.eventCreatorId
                ? activity.eventCreatorId
                : activity.eventcreatorid,
        );
    }

    toggleModal = () => {
        this.setState({
            displaySignupModal: !this.state.displaySignupModal,
        });
        !this.state.isOrganisation && this.getSignUpStatus();
    };

    handleSignupError = (errorTitle, errorMessage) => {
        Alert.alert(errorTitle, errorMessage);
    };

    getSignUpStatus = async () => {
        const authToken = await getAuthToken();
        const activity = this.props.navigation.getParam("activity");
        const eventId = activity.eventid ? activity.eventid : activity.eventId; //TODO fix lack of camelcase
        await request
            .get(`${REACT_APP_API_URL}/event/${eventId}/signUp/status`)
            .set("authorization", authToken)
            .then(res => {
                if (res.body.data.signup.confirmed === false) {
                    this.setState({signedUp: false});
                } else {
                    this.setState({signedUp: true});
                }
            })
            .catch(err => {
                this.setState({signedUp: false});

                console.log(err);
            });
    };

    getCreatorInfo = async id => {
        const authToken = await getAuthToken();
        const response = await request
            .get(`${REACT_APP_API_URL}/profile`)
            .set("authorization", authToken)
            .query({otherUserId: id})
            .then(res => {
                return res.body.data;
            })
            .catch(err => {
                console.log(err);
            });

        const email = response.user.email;

        const eventCreator = response.individual
            ? response.individual
            : response.organisation;
        let fullName = "";
        if (eventCreator.firstName) {
            fullName = eventCreator.firstName + " " + eventCreator.lastName;
        } else {
            fullName =
                eventCreator.pocFirstName + " " + eventCreator.pocLastName;
        }
        const phoneNumber = eventCreator.phoneNumber;
        const org_name = eventCreator.firstName
            ? eventCreator.firstName
            : eventCreator.name;
        const address = eventCreator.address;
        const city = address.townCity;

        this.setState({
            city: city,
            org_name: org_name,
            location: city,

            email: email,
            fullName: fullName,
            phoneNumber: phoneNumber,
            loaded: true,
        });
    };

    getEventInfo = async activity => {
        const eventCity = activity.city;
        const postcode = activity.postcode;

        const address1 = activity.address1 + ", ";
        const address2 = activity.address2 ? activity.address2 + ", " : "";
        const lat = Number(activity.lat);
        const long = Number(activity.long);

        //when filtering by cause, the activity object contains the proeprty causeId instead of causes
        const causeIds = activity.causes ? activity.causes : [activity.causeId];

        const causes = await this.fetchSelectedCauses(causeIds);
        const full_location = address1 + address2 + eventCity + " " + postcode;

        const favourited = this.props.navigation.getParam("favourited");

        this.setState({
            full_location,
            causes: causes,
            favourited,
            lat,
            long,
            eventCity,
            spots_taken: activity.spots - activity.spotsRemaining,
            spots: activity.spots,
            full_date: getDate(activity.date),
            full_time: formatAMPM(activity.date),
            description: activity.content,
            activity_name: activity.name,
            addInfo: activity.addInfo,
            photoId: activity.photoId,
            womenOnly: activity.womenOnly,
            physical: activity.physical,
            addressVisible: activity.addressVisible,
            eventId: activity.eventId,
        });
    };

    /**
     * Fetches the selected causes related to an event
     * Endpoint returns only cause ids, so causes need to be fetched
     */
    fetchSelectedCauses = async causeIds => {
        const authToken = await getAuthToken();
        const causes = [];

        await request
            .get(`${REACT_APP_API_URL}/causes`)
            .set("authorization", authToken)
            .then(res => {
                Array.from(res.body.data).forEach(cause => {
                    if (causeIds && causeIds.includes(cause.id)) {
                        causes.push(cause);
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });

        return causes;
    };

    async toggleFavourite() {
        const authToken = await getAuthToken();

        if (!this.state.favourited) {
            request
                .post(
                    `${REACT_APP_API_URL}/event/${
                        this.state.eventId
                    }/favourite`,
                )
                .set("authorization", authToken)
                .then(result => {
                    this.setState({
                        favourited: true,
                    });
                })
                .catch(er => {
                    console.log(er);
                });
        } else {
            request
                .post(
                    `${REACT_APP_API_URL}/event/${
                        this.state.eventId
                    }/favourite/delete`,
                )
                .set("authorization", authToken)
                .then(result => {
                    this.setState({
                        favourited: false,
                    });
                })
                .catch(er => {
                    console.log(er);
                });
        }
    }

    render() {
        const activity = this.props.navigation.getParam("activity");
        const {lat, long, addressVisible, signedUp} = this.state;
        const newLat = !isNaN(lat) ? lat : 51.511764;
        const newLong = !isNaN(long) ? long : -0.11623;
        return (
            <SafeAreaView
                style={[Styles.container, {backgroundColor: Colours.white}]}>
                {/* HEADER */}
                <View
                    style={[
                        Styles.ph24,
                        {
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            backgroundColor: Colours.white,
                            marginBottom: 20,
                        },
                    ]}>
                    <View style={{alignItems: "flex-start", width: FORM_WIDTH}}>
                        <PageHeader title={activity.name} fontSize={18} />
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* CARD HEADER */}
                    <View
                        style={{
                            backgroundColor: Colours.backgroundWhite,
                            height: 60,
                            paddingHorizontal: 24,
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <Image
                            source={icons.profile}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 75,
                                paddingHorizontal: 24,
                            }}
                            resizeMode="cover"
                        />
                        <View style={{alignItems: "center"}}>
                            <View
                                style={{
                                    alignItems: "flex-start",
                                    paddingLeft: 15,
                                }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyItems: "flex-start",
                                    }}>
                                    <RegularText
                                        style={{
                                            fontSize: 20,
                                            color: Colours.black,
                                            fontWeight: "500",
                                        }}>
                                        {this.state.org_name}
                                    </RegularText>
                                </View>
                                <View>
                                    <RegularText
                                        style={{
                                            fontSize: 15,
                                            color: Colours.lightGrey,
                                            fontWeight: "500",
                                            flexWrap: "wrap",
                                        }}>
                                        {this.state.location}
                                    </RegularText>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                alignItem: "flex-end",
                                justifyContent: "flex-end",
                            }}>
                            <TouchableOpacity
                                style={{alignSelf: "flex-end"}}
                                onPress={() => {
                                    this.setState({
                                        sharing: true,
                                    });
                                    this.toggleModal();
                                }}>
                                <Image
                                    source={icons.share}
                                    style={{
                                        alignSelf: "flex-end",
                                        width: 30,
                                        height: 30,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* CARD */}
                    <View style={[Styles.container, Styles.ph24, Styles.pt8]}>
                        <View style={[Styles.pb24, Styles.bottom]}>
                            <Image
                                source={{
                                    uri: `https://picsum.photos/seed/${
                                        activity.eventId
                                    }/800/200`,
                                }}
                                style={{
                                    flex: 1,
                                    width: null,
                                    height: 200,
                                    marginBottom: 10,
                                }}
                                resizeMode="cover"
                            />
                            <Image
                                source={icons.date}
                                style={{
                                    position: "absolute",
                                    top: 5,
                                    left: 5,
                                    height: 50,
                                    width: 50,
                                    resizeMode: "contain",
                                }}
                            />
                            <Image
                                source={icons.grey_circle}
                                style={{
                                    position: "absolute",
                                    top: 5,
                                    right: 5,
                                    height: 50,
                                    width: 50,
                                    resizeMode: "contain",
                                }}
                            />
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    top: 16,
                                    right: 15,
                                }}
                                onPress={() => this.toggleFavourite()}>
                                <Image
                                    source={
                                        this.state.favourited
                                            ? icons.fave_active
                                            : icons.fave_inactive
                                    }
                                    style={{
                                        height: 30,
                                        width: 30,
                                        resizeMode: "contain",
                                    }}
                                />
                            </TouchableOpacity>

                            <RegularText
                                style={[styles.dateText, {top: 5, left: 0}]}>
                                {` ${new Date(activity.date).getDate()}`}
                            </RegularText>
                            <RegularText
                                style={[styles.dateText, {top: 25, left: 0}]}>
                                {`  ${getMonthName(activity.date)}`}
                            </RegularText>
                            <View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}>
                                    <View
                                        style={{
                                            width: HALF + HALF / 4,
                                            justifyContent: "center",
                                        }}>
                                        <ProgressBar
                                            current={this.state.spots_taken}
                                            max={this.state.spots}
                                        />
                                    </View>
                                    <RegularText style={{fontSize: 16}}>
                                        {this.state.spots_taken}/
                                        {this.state.spots} SPOTS TAKEN
                                    </RegularText>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                            }}>
                            <Image
                                source={icons.calendar}
                                style={{
                                    alignSelf: "flex-start",
                                    justifyContent: "center",
                                    width: 20,
                                    height: 20,
                                    marginRight: 10,
                                }}
                                resizeMode="contain"
                            />
                            <View>
                                <RegularText
                                    style={{
                                        fontSize: 18,
                                        color: Colours.black,
                                        fontWeight: "500",
                                    }}>
                                    {this.state.full_date}
                                </RegularText>
                                <RegularText
                                    style={{
                                        fontSize: 15,
                                        color: Colours.lightGrey,
                                        fontWeight: "500",
                                    }}>
                                    {this.state.full_time}
                                </RegularText>
                            </View>
                        </View>
                        <View style={[Styles.pv16, {flexDirection: "row"}]}>
                            <Image
                                source={icons.location}
                                style={{
                                    alignSelf: "flex-start",
                                    justifyContent: "center",
                                    width: 20,
                                    height: 20,
                                    marginRight: 10,
                                }}
                                resizeMode="contain"
                            />
                            <View>
                                <RegularText
                                    style={{
                                        fontSize: 18,
                                        color: Colours.black,
                                        fontWeight: "500",
                                    }}>
                                    {addressVisible
                                        ? this.state.full_location
                                        : this.state.eventCity}
                                </RegularText>
                            </View>
                        </View>
                    </View>

                    {/* INFORMATION */}
                    <View
                        style={[
                            Styles.ph24,
                            Styles.pv16,
                            {backgroundColor: Colours.backgroundWhite},
                        ]}>
                        <RegularText style={styles.headerText}>
                            What Will Volunteers Do?
                        </RegularText>
                        <RegularText>{this.state.description}</RegularText>
                        <RegularText style={styles.headerText}>
                            Who to Contact
                        </RegularText>
                        <RegularText>Name: {this.state.fullName}</RegularText>
                        <RegularText>Email: {this.state.email}</RegularText>
                        <RegularText>
                            Number: {this.state.phoneNumber}
                        </RegularText>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: 10,
                            }}>
                            <TouchableOpacity
                                style={styles.contactButton}
                                activeOpacity={0.9}
                                onPress={() =>
                                    Communications.phonecall(
                                        this.state.phoneNumber,
                                        true,
                                    )
                                }>
                                <RegularText
                                    style={{
                                        fontSize: 18,
                                        color: Colours.white,
                                    }}>
                                    CALL
                                </RegularText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.contactButton}
                                activeOpacity={0.9}
                                onPress={() =>
                                    Communications.email(
                                        [this.state.email],
                                        null,
                                        null,
                                        `Karma - ${this.state.activity_name}`,
                                        null,
                                    )
                                }>
                                <RegularText
                                    style={{
                                        fontSize: 18,
                                        color: Colours.white,
                                    }}>
                                    EMAIL
                                </RegularText>
                            </TouchableOpacity>
                        </View>
                        <RegularText style={styles.headerText}>
                            Related Causes
                        </RegularText>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-end",
                                justifyContent: "flex-start",
                            }}>
                            {this.state.causes.length > 0 && (
                                <View style={CauseStyles.container}>
                                    {this.state.causes.map(cause => {
                                        return (
                                            <CauseItem
                                                cause={cause}
                                                key={cause.id}
                                                isDisabled={true}
                                            />
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                        <RegularText style={styles.headerText}>
                            Where
                        </RegularText>
                        {addressVisible ? (
                            <View style={{height: 200}}>
                                {this.state.loaded && (
                                    <MapView
                                        zoomControlEnabled={false}
                                        zoomEnabled={false}
                                        rotateEnabled={false}
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: newLat,
                                            longitude: newLong,
                                            latitudeDelta: 0.005,
                                            longitudeDelta: 0.005,
                                        }}
                                        scrollEnabled={false}>
                                        {
                                            <MapView.Marker
                                                coordinate={{
                                                    latitude: newLat,
                                                    longitude: newLong,
                                                }}
                                                pinColor={"green"}
                                            />
                                        }
                                    </MapView>
                                )}
                            </View>
                        ) : (
                            <RegularText>
                                The address for this event is not public, and
                                will be sent to you when you are approved to
                                attend the event.
                            </RegularText>
                        )}
                        <RegularText style={styles.headerText}>
                            Important
                        </RegularText>
                        <RegularText>
                            The minimum age for this event is 18.
                        </RegularText>
                        {this.state.photoId && (
                            <RegularText>
                                You will be required to show photo ID upon
                                arrival.
                            </RegularText>
                        )}
                        {this.state.womenOnly && (
                            <RegularText>This event is women only.</RegularText>
                        )}
                        {this.state.physical && (
                            <RegularText>
                                This event involves physical activity.
                            </RegularText>
                        )}
                        {this.state.addInfo && (
                            <RegularText>
                                Additional information will be sent by email.
                            </RegularText>
                        )}
                    </View>
                </ScrollView>

                {/** NEXT BUTTON */}
                <View
                    style={{
                        height: 0.08 * SCREEN_HEIGHT,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        backgroundColor: Colours.white,
                    }}>
                    <View style={{width: FORM_WIDTH}}>
                        {this.state.signedUp ? (
                            //yes
                            <TouchableOpacity
                                style={{
                                    ...Styles.roundButton,

                                    backgroundColor: "#D40000",
                                }}
                                onPress={() => {
                                    this.setState({
                                        sharing: false,
                                    });
                                    this.toggleModal();
                                }}
                                activeOpacity={0.9}>
                                <RegularText
                                    style={{
                                        fontSize: 20,
                                        justifyContent: "center",
                                        textAlign: "center",
                                        color: "white",
                                    }}>
                                    {"Cancel Attendance"}
                                </RegularText>
                            </TouchableOpacity>
                        ) : (
                            //no
                            <GradientButton
                                title={
                                    !this.state.isOrganisation
                                        ? "Attend"
                                        : "Add to Calendar"
                                }
                                onPress={() => {
                                    this.setState({
                                        sharing: false,
                                    });
                                    this.toggleModal();
                                }}
                            />
                        )}
                    </View>
                </View>
                <BottomModal
                    visible={this.state.displaySignupModal}
                    toggleModal={this.toggleModal}>
                    {this.state.sharing ? (
                        <ShareActivity activity={activity} />
                    ) : (
                        <SignUpActivity
                            activity={activity}
                            onConfirm={this.toggleModal}
                            onError={this.handleSignupError}
                            signedUp={signedUp}
                            isOrganisation={this.state.isOrganisation}
                        />
                    )}
                </BottomModal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        fontWeight: "500",
        color: Colours.black,
        paddingVertical: 10,
    },
    dateText: {
        position: "absolute",
        height: 50,
        width: 50,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "500",
        color: "white",
    },
    contactButton: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 32,
        height: 40,
        width: HALF,
        backgroundColor: Colours.blue,
        marginVertical: 10,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default ActivityInfoScreen;
