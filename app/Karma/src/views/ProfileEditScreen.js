import React, {Component} from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    Text,
    Platform,
    Easing,
    Keyboard,
} from "react-native";
import {RegularText} from "../components/text";
import {GradientButton} from "../components/buttons";
import Styles from "../styles/Styles";
import EditableText from "../components/EditableText";
import AnimatedProgressWheel from "react-native-progress-wheel";
import BottomModal from "../components/BottomModal";
import CauseStyles from "../styles/CauseStyles";
import CauseItem from "../components/causes/CauseItem";
import Colours from "../styles/Colours";
import CauseContainer from "../components/causes/CauseContainer";
import {TextInput} from "../components/input";
import AddressInput from "../components/input/AddressInput";
import {getAuthToken} from "../util/credentials";
import {RadioInput} from "../components/radio";
import {initialMode} from "react-native-dark-mode";
const isDarkMode = initialMode === "dark";
const request = require("superagent");
const _ = require("lodash");
import {REACT_APP_API_URL} from "react-native-dotenv";
import ImagePicker from "react-native-image-picker";
import CarouselStyles from "../styles/CarouselStyles";
import ActivityCard from "../components/activities/ActivityCard";
import PageHeader from "../components/PageHeader";
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get("window");
const formWidth = 0.8 * SCREEN_WIDTH;
const HALF = formWidth / 2;

const icons = {
    edit_white: require("../assets/images/general-logos/edit-white.png"),
    calendar: require("../assets/images/general-logos/calendar-dark.png"),
    photo_add: require("../assets/images/general-logos/photo-plus-background.png"),
    new_cause: require("../assets/images/general-logos/new_cause.png"),
    ribbon: require("../assets/images/general-logos/ribbon.png"),
    orange_circle: require("../assets/images/general-logos/orange-circle.png"),
};

/**
 * @class ProfileEditScreen represents the screen displayed to the user
 * when they select the 'edit profile' button.
 */

class ProfileEditScreen extends Component {
    constructor(props) {
        super(props);
        const profile = this.props.navigation.getParam("profile");
        this.state = {
            points: profile.points,
            location: profile.location,
            user: {username: profile.user.username},
            isOrganisation: profile.isOrganisation,
            individual: {
                firstName: profile.firstName,
                lastName: profile.lastName,
                gender: profile.gender,
                bio: profile.bio,
                address: {
                    addressLine1: profile.address.addressLine1,
                    addressLine2: profile.address.addressLine2,
                    townCity: profile.address.townCity,
                    countryState: profile.address.countryState,
                    postCode: profile.address.postCode,
                },
            },
            organisation: {
                name: profile.orgName,
                pocFirstName: profile.pocFirstName,
                pocLastName: profile.pocLastName,
                organisationType: profile.organisationType,
                phoneNumber: profile.orgPhoneNumber,
                address: {
                    addressLine1: profile.address.addressLine1,
                    addressLine2: profile.address.addressLine2,
                    townCity: profile.address.townCity,
                    countryState: profile.address.countryState,
                    postCode: profile.address.postCode,
                },
            },
            causes: profile.causes,
            displaySignupModal: false,
            photo: profile.photo,
            photoLoading: false,
        };
        // maintain 'plus' icon when profile pic is default
        try {
            if (this.state.photo.uri.includes(`${REACT_APP_API_URL}`)) {
                this.state.photo = null;
            }
        } catch (e) {
            console.log(e);
            this.state.photo = null;
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.getGender = this.getGender.bind(this);
        this.baseState = this.state;
    }

    toggleModal = () => {
        this.setState({
            displaySignupModal: !this.state.displaySignupModal,
        });
    };

    handleError = (errorTitle, errorMessage) => {
        Alert.alert(errorTitle, errorMessage);
    };
    onChangeText = event => {
        const {name, text} = event;
        switch (name) {
            case "username":
                this.setState({user: {[name]: text}});
                break;
            case "lastName":
            case "firstName":
                this.setState(prevState => {
                    return {
                        individual: {
                            ...prevState.individual,
                            [name]: text,
                        },
                    };
                });
                break;
            case "orgName":
            case "pocFirstName":
            case "pocLastName":
            case "organisationType":
            case "phoneNumber":
                this.setState(prevState => {
                    return {
                        organisation: {
                            ...prevState.organisation,
                            [name]: text,
                        },
                    };
                });
                break;
            default:
                this.setState({[name]: text});
        }
    };

    onInputChange = inputState => {
        this.state.isOrganisation
            ? this.setState(prevState => {
                  return {
                      organisation: {
                          ...prevState.organisation,
                          address: {
                              addressLine1: inputState.address1,
                              addressLine2: inputState.address2,
                              townCity: inputState.city,
                              countryState: inputState.region,
                              postCode: inputState.postcode,
                          },
                      },
                  };
              })
            : this.setState(prevState => {
                  return {
                      individual: {
                          ...prevState.individual,
                          address: {
                              addressLine1: inputState.address1,
                              addressLine2: inputState.address2,
                              townCity: inputState.city,
                              countryState: inputState.region,
                              postCode: inputState.postcode,
                          },
                      },
                  };
              });
    };

    /**
     * Reload the page when user presses 'update' button
     * send the changes made to the server via POST request
     */
    onUpdatePressed = async () => {
        const {navigate} = this.props.navigation;
        const authToken = await getAuthToken();
        const dataChanged = {};
        if (!_.isEqual(this.state.user, this.baseState.user)) {
            dataChanged.user = this.state.user;
        }
        if (
            !this.state.isOrganisation &&
            !_.isEqual(this.state.individual, this.baseState.individual)
        ) {
            dataChanged.individual = this.state.individual;
            if (
                _.isEqual(
                    this.state.individual.address,
                    this.baseState.individual.address,
                )
            ) {
                delete dataChanged.individual.address;
            }
        }
        if (
            this.state.isOrganisation &&
            !_.isEqual(this.state.organisation, this.baseState.organisation)
        ) {
            dataChanged.organisation = this.state.organisation;
            if (
                _.isEqual(
                    this.state.organisation.address,
                    this.baseState.organisation.address,
                )
            ) {
                delete dataChanged.organisation.address;
            }
        }
        await request
            .post(`${REACT_APP_API_URL}/profile/edit`)
            .set("authorization", authToken)
            .send({
                data: dataChanged,
            })
            .then(async res => {
                navigate("Profile");
            })
            .catch(err => {
                console.log(err.message);
                Alert.alert("Server Error", err.message);
            });
    };

    /**
     * Load in the current gender
     */
    getGender = character => {
        if (character === "m") {
            return "male";
        }
        if (character === "f") {
            return "female";
        }
        if (character === "x") {
            return "non-binary";
        }
    };

    /**
     * Update the gender if the user changes it
     */
    setGender = selectedGender => {
        const genderCharacter =
            selectedGender === "male"
                ? "m"
                : selectedGender === "female"
                ? "f"
                : "x";
        this.setState(prevState => {
            return {
                individual: {
                    ...prevState.individual,
                    gender: genderCharacter,
                },
            };
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
        this.setState({photoLoading: true});

        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                this.imageLoader.animateTo(95, 1200, Easing.quad);
                this.setState({photo: response});
                return this.handleUploadPhoto();
            } else {
                this.imageLoader.animateTo(0, 100, Easing.quad);
                this.setState({photoLoading: false});
            }
        });
    };

    /**
     * Uploads the photo the user picks to the server via a POST request
     * Displays an error to the user if the process fails
     */
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
                this.imageLoader.animateTo(100, 400, Easing.quad);
                const response = res.json();
                if (res.status === 200) {
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
        this.setState({photoLoading: false});
        this.fetchProfilePicture();
    };

    /**
     * Display the profile picture to a user
     * Uses a GET request to the server
     */
    fetchProfilePicture = async () => {
        this.imageLoader.animateTo(0, 0);

        const authToken = await getAuthToken();
        const endpointUsertype = this.state.isOrganisation
            ? "organisation"
            : "individual";
        this.setState({photo: null, photoLoading: true});

        await request
            .get(`${REACT_APP_API_URL}/avatar/${endpointUsertype}`)
            .set("authorization", authToken)
            .then(res => {
                const imageLocation =
                    res.body.pictureUrl + "?t=" + new Date().getTime(); // cache buster

                // preserve 'plus' icon on edit screen if profile is default
                if (imageLocation.includes(`${REACT_APP_API_URL}`)) {
                    this.setState({photo: null});
                } else {
                    this.setState({photo: {uri: imageLocation}});
                }
            })
            .catch(err => {
                console.log(err);
            });
        this.setState({photoLoading: false});
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
        const {
            isOrganisation,
            individual,
            organisation,
            photoLoading,
        } = this.state;
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                enabled>
                <View style={[Styles.ph24, Styles.pv16]}>
                    <PageHeader title="Edit Profile" />
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="never">
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
                                        opacity: 0,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colours.blue,
                                height: HALF,
                                width: SCREEN_WIDTH,
                                alignSelf: "center",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingRight: 30,
                                paddingLeft: 30,
                                paddingBottom: 40,
                                flexDirection: "row",
                            }}>
                            {/* Profile Picture */}
                            <View>
                                <TouchableOpacity
                                    onPress={this.handleChoosePhoto}>
                                    <Image
                                        style={{
                                            paddingVertical: 5,
                                            width: HALF * 0.8,
                                            height: HALF * 0.8,
                                            borderRadius: 75,
                                            opacity: photoLoading ? 0.5 : 1,
                                        }}
                                        resizeMode="cover"
                                        source={icons.photo_add}
                                    />
                                    <View
                                        style={{
                                            marginTop: -1 * HALF * 0.8,
                                            marginLeft: -2,
                                            opacity: photoLoading ? 1 : 0,
                                        }}>
                                        <AnimatedProgressWheel
                                            ref={ref =>
                                                (this.imageLoader = ref)
                                            }
                                            size={HALF * 0.8 + 3}
                                            width={20}
                                            color={Colours.white}
                                            backgroundColor={Colours.blue}
                                        />
                                    </View>
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
                                            {this.state.organisation.name}
                                        </Text>
                                    )}
                                    {!this.state.isOrganisation && (
                                        <Text
                                            numberOfLines={1}
                                            style={[styles.nameText]}>
                                            {this.state.individual.firstName}{" "}
                                            {this.state.individual.lastName}
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
                                                this.state.organisation
                                                    .organisationType}
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
                                {isOrganisation ? (
                                    <View>
                                        <RegularText style={styles.bioHeader}>
                                            Point of Contact First Name
                                        </RegularText>
                                        <TextInput
                                            value={organisation.pocFirstName}
                                            name="pocFirstName"
                                            onChange={this.onChangeText}
                                            onSubmitEditing={() =>
                                                Keyboard.dismiss()
                                            }
                                        />
                                        <RegularText style={styles.bioHeader}>
                                            Point of Contact Last Name
                                        </RegularText>
                                        <TextInput
                                            value={organisation.pocLastName}
                                            inputRef={ref =>
                                                (this.lastName = ref)
                                            }
                                            name="pocLastName"
                                            onChange={this.onChangeText}
                                            onSubmitEditing={() =>
                                                Keyboard.dismiss()
                                            }
                                        />
                                    </View>
                                ) : (
                                    <View>
                                        <RegularText style={styles.bioHeader}>
                                            First Name
                                        </RegularText>
                                        <TextInput
                                            value={individual.firstName}
                                            name="firstName"
                                            onChange={this.onChangeText}
                                            onSubmitEditing={() =>
                                                Keyboard.dismiss()
                                            }
                                        />
                                        <RegularText style={styles.bioHeader}>
                                            Last Name
                                        </RegularText>
                                        <TextInput
                                            value={individual.lastName}
                                            name="lastName"
                                            onChange={this.onChangeText}
                                            onSubmitEditing={() =>
                                                Keyboard.dismiss()
                                            }
                                        />
                                    </View>
                                )}
                                <RegularText style={styles.bioHeader}>
                                    Username
                                </RegularText>
                                <TextInput
                                    value={individual.username}
                                    inputRef={ref => (this.username = ref)}
                                    autoCapitalize="none"
                                    onChange={this.onChangeText}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    name="username"
                                />
                                {isOrganisation && (
                                    <View>
                                        <RegularText style={styles.bioHeader}>
                                            Organisation Phone Number
                                        </RegularText>
                                        <TextInput
                                            value={organisation.phoneNumber}
                                            name="phoneNumber"
                                            onChange={this.onChangeText}
                                        />
                                    </View>
                                )}
                                {!isOrganisation && (
                                    <View>
                                        <RegularText style={styles.bioHeader}>
                                            Gender
                                        </RegularText>
                                        <RadioInput
                                            values={[
                                                {value: "male", title: "Male"},
                                                {
                                                    value: "female",
                                                    title: "Female",
                                                },
                                                {
                                                    value: "non-binary",
                                                    title: "Non-Binary",
                                                },
                                            ]}
                                            value={this.getGender(
                                                this.state.individual.gender,
                                            )}
                                            onValue={value =>
                                                this.setGender(value)
                                            }
                                        />
                                    </View>
                                )}
                                <RegularText style={styles.bioHeader}>
                                    Bio
                                </RegularText>
                                <View style={{flexWrap: "wrap"}}>
                                    <EditableText
                                        text={
                                            this.state.individual.bio === ""
                                                ? "Write bio here."
                                                : this.state.individual.bio
                                        }
                                        style={styles.contentText}
                                        onChange={val =>
                                            this.setState(prevState => {
                                                return {
                                                    individual: {
                                                        ...prevState.individual,
                                                        bio: val,
                                                    },
                                                };
                                            })
                                        }
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-end",
                                        flexWrap: "wrap",
                                    }}>
                                    <RegularText style={styles.bioHeader}>
                                        Causes
                                    </RegularText>
                                    <View style={CauseStyles.container}>
                                        {this.state.causes.map(cause => {
                                            return (
                                                <CauseItem
                                                    cause={cause}
                                                    key={cause.id}
                                                    display={true}
                                                    isDisabled={true}
                                                />
                                            );
                                        })}
                                        <TouchableOpacity
                                            onPress={this.toggleModal}>
                                            <Image
                                                source={icons.new_cause}
                                                style={{
                                                    height: SCREEN_WIDTH / 5,
                                                    width: SCREEN_WIDTH / 5,
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
                                    </View>
                                </View>
                                <RegularText style={styles.bioHeader}>
                                    Address
                                </RegularText>
                                <AddressInput
                                    onChange={this.onInputChange}
                                    address1={
                                        isOrganisation
                                            ? organisation.address.addressLine1
                                            : individual.address.addressLine1
                                    }
                                    address2={
                                        isOrganisation
                                            ? organisation.address.addressLine2
                                            : individual.address.addressLine2
                                    }
                                    city={
                                        isOrganisation
                                            ? organisation.address.townCity
                                            : individual.address.townCity
                                    }
                                    region={
                                        isOrganisation
                                            ? organisation.address.countryState
                                            : individual.address.countryState
                                    }
                                    postcode={
                                        isOrganisation
                                            ? organisation.address.postCode
                                            : individual.address.postCode
                                    }
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                height: 0.08 * SCREEN_HEIGHT,
                                justifyContent: "flex-end",
                                alignItems: "center",
                                marginBottom: 100,
                                backgroundColor: Colours.white,
                            }}>
                            <View style={{width: formWidth}}>
                                <GradientButton
                                    onPress={this.onUpdatePressed}
                                    title="Update"
                                />
                            </View>
                        </View>
                        <BottomModal
                            visible={this.state.displaySignupModal}
                            toggleModal={this.toggleModal}>
                            <CauseContainer
                                onSubmit={this.toggleModal}
                                onError={this.handleError}
                            />
                        </BottomModal>
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
        fontSize: 20,
        color: Colours.white,
        fontWeight: "bold",
    },
    usernameText: {
        fontSize: 20,
        color: Colours.white,
    },
    locationText: {
        fontSize: 20,
        color: isDarkMode ? Colours.grey : "#75C4C3",
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
