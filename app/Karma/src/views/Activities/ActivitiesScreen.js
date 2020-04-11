import React, {Component} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    ScrollView,
    Alert,
} from "react-native";
import {RegularText} from "../../components/text";
import Colours from "../../styles/Colours";
import ActivitiesAllScreen from "./ActivitiesAllScreen";
import ActivitiesCausesScreen from "./ActivitiesCausesScreen";
import ActivitiesGoingScreen from "./ActivitiesGoingScreen";
import ActivitiesFavouritesScreen from "./ActivitiesFavouritesScreen";
import ActivityFilters from "../../components/activities/ActivityFilters";
import {getCalendarPerms, askCalendarPerms} from "../../util/calendar";
import Modal, {ModalContent, SlideAnimation} from "react-native-modals";
import {REACT_APP_API_URL} from "react-native-dotenv";
import {getAuthToken} from "../../util/credentials";
const request = require("superagent");

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get("window");
const formWidth = 0.8 * SCREEN_WIDTH;

const icons = {
    filter: require("../../assets/images/general-logos/filter.png"),
    calendar: require("../../assets/images/general-logos/calendar-dark.png"),
};

class ActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: ActivitiesAllScreen,
            modalVisible: false,
            filters: {},
            isOrganisation: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.onUpdateFilters = this.onUpdateFilters.bind(this);
    }

    onUpdateFilters = async inputState => {
        this.toggleModal();
        await this.setState({
            filters: inputState.filters,
        });
    };

    toggleModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };

    async componentDidMount() {
        const authToken = await getAuthToken();
        const perms = await getCalendarPerms();
        if (perms === "undetermined") {
            await askCalendarPerms();
        }
        await request
            .get(`${REACT_APP_API_URL}/profile`)
            .set("authorization", authToken)
            .then(res => {
                if (res.body.data.organisation) {
                    this.setState({isOrganisation: true});
                    console.log("fetching activities for organisation ");
                } else {
                    this.setState({isOrganisation: false});
                    console.log("fetching activities for individual ");
                }
            })
            .catch(err => {
                Alert.alert("Unable to load profile", err);
            });
    }

    setScreen(selectedScreen) {
        this.setState({
            display: selectedScreen,
        });
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: Colours.white, flex: 1}}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    enabled>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingTop: 24,
                            paddingLeft: 24,
                        }}>
                        <RegularText
                            style={{
                                fontSize: 24,
                                fontWeight: "600",
                                color: Colours.black,
                                paddingLeft: 16,
                            }}>
                            Activities
                        </RegularText>
                        {/* Filters Button */}
                        <TouchableOpacity
                            style={{alignSelf: "center"}}
                            onPress={this.toggleModal}>
                            <Image
                                source={icons.filter}
                                style={{
                                    height: 25,
                                    alignSelf: "center",
                                    marginRight: -7,
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    {/* FILTERS MODAL */}
                    <Modal
                        visible={this.state.modalVisible}
                        height={SCREEN_HEIGHT * 0.5}
                        width={formWidth}
                        onTouchOutside={this.toggleModal}
                        propagateSwipe={true}
                        scrollHorizontal={true}
                        modalAnimation={
                            new SlideAnimation({
                                slideFrom: "top",
                                initialValue: 0, // optional
                                useNativeDriver: true, // optional
                            })
                        }
                        onSwipeOut={event => {
                            this.setState({modalVisible: false});
                        }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View
                                style={{flex: 1}}
                                onStartShouldSetResponder={() => true}>
                                <ModalContent>
                                    <ActivityFilters
                                        onUpdateFilters={this.onUpdateFilters}
                                        filters={this.state.filters}
                                    />
                                </ModalContent>
                            </View>
                        </ScrollView>
                    </Modal>
                    {/* NAVIGATION TAB */}
                    <View style={{paddingBottom: 30, paddingHorizontal: 24}}>
                        <View
                            style={{
                                flex: 1,
                                height: 50,
                                paddingBottom: 10,
                                flexDirection: "row",
                                justifyContent: "flex-start",
                            }}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.setScreen(ActivitiesAllScreen)
                                }
                                style={
                                    this.state.display === ActivitiesAllScreen
                                        ? styles.navButtonActive
                                        : styles.navButtonInactive
                                }>
                                <RegularText
                                    style={
                                        this.state.display ===
                                        ActivitiesAllScreen
                                            ? styles.navTextActive
                                            : styles.navTextInactive
                                    }>
                                    All
                                </RegularText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    this.setScreen(ActivitiesCausesScreen)
                                }
                                style={
                                    this.state.display ===
                                    ActivitiesCausesScreen
                                        ? styles.navButtonActive
                                        : styles.navButtonInactive
                                }>
                                <RegularText
                                    style={
                                        this.state.display ===
                                        ActivitiesCausesScreen
                                            ? styles.navTextActive
                                            : styles.navTextInactive
                                    }>
                                    Causes
                                </RegularText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    this.setScreen(ActivitiesGoingScreen)
                                }
                                style={
                                    this.state.display === ActivitiesGoingScreen
                                        ? styles.navButtonActive
                                        : styles.navButtonInactive
                                }>
                                <RegularText
                                    style={
                                        this.state.display ===
                                        ActivitiesGoingScreen
                                            ? styles.navTextActive
                                            : styles.navTextInactive
                                    }>
                                    Going
                                </RegularText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    this.setScreen(ActivitiesFavouritesScreen)
                                }
                                style={
                                    this.state.display ===
                                    ActivitiesFavouritesScreen
                                        ? styles.navButtonActive
                                        : styles.navButtonInactive
                                }>
                                <RegularText
                                    style={
                                        this.state.display ===
                                        ActivitiesFavouritesScreen
                                            ? styles.navTextActive
                                            : styles.navTextInactive
                                    }>
                                    Favourites
                                </RegularText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <this.state.display
                        filters={this.state.filters}
                        isOrganisation={this.state.isOrganisation}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    navButtonActive: {
        height: 30,
        width: "auto",
        paddingHorizontal: 10,
        marginHorizontal: 10,
        backgroundColor: Colours.blue,
        borderWidth: 0,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    navButtonInactive: {
        height: 30,
        width: "auto",
        paddingHorizontal: 10,
        marginHorizontal: 10,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    navTextInactive: {
        fontSize: 15,
        fontWeight: "700",
        color: Colours.lightGrey,
    },
    navTextActive: {
        fontSize: 15,
        fontWeight: "700",
        color: Colours.white,
    },
});

export default ActivitiesScreen;
