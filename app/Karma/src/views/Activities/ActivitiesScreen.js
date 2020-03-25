import React, {Component} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Switch,
    Dimensions,
} from "react-native";
import Slider from "@react-native-community/slider";
import Modal, {ModalContent} from "react-native-modals";
import {RegularText} from "../../components/text";
import Colours from "../../styles/Colours";
import ActivitiesAllScreen from "./ActivitiesAllScreen";
import ActivitiesCausesScreen from "./ActivitiesCausesScreen";
import ActivitiesGoingScreen from "./ActivitiesGoingScreen";
import ActivitiesFavouritesScreen from "./ActivitiesFavouritesScreen";
import Calendar from "../../components/Calendar";
import {Button} from "../../components/buttons";
import {getCalendarPerms, askCalendarPerms} from "../../util/calendar";

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
            womenOnly: false,
            locationVisible: false,
            physicalActivity: false,
            distance: 90,
            display: ActivitiesAllScreen,
            visible: false,
            calendarVisible: false,
        };
    }

    async componentDidMount() {
        const perms = await getCalendarPerms();
        if (perms === "undetermined") {
            await askCalendarPerms();
        }
    }

    static navigationOptions = {
        headerShown: false,
    };

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
                        <TouchableOpacity
                            style={{alignSelf: "center"}}
                            onPress={() => {
                                this.setState({visible: true});
                            }}>
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

                    {/* FILTER MODAL */}
                    <View>
                        <Modal
                            visible={this.state.visible}
                            height={
                                this.state.calendarVisible
                                    ? SCREEN_HEIGHT * 0.5
                                    : SCREEN_HEIGHT * 0.55
                            }
                            width={formWidth}
                            onTouchOutside={() => {
                                this.setState({visible: false});
                            }}>
                            <ModalContent>
                                {/* AVAILABILITY */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}>
                                    <RegularText style={styles.contentText}>
                                        Availability:
                                    </RegularText>
                                    <View style={styles.leftItem}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    calendarVisible: !this.state
                                                        .calendarVisible,
                                                });
                                            }}>
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
                                {this.state.calendarVisible && (
                                    <View
                                        style={{
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}>
                                        <View>
                                            <Calendar />
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-evenly",
                                            }}>
                                            <Button
                                                size={15}
                                                ph={20}
                                                title={"Set Dates"}
                                                onPress={() => {
                                                    this.setState({
                                                        calendarVisible: false,
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* DISTANCE */}
                                {!this.state.calendarVisible && (
                                    <View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}>
                                            <RegularText
                                                style={styles.contentText}>
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
                                )}

                                {/* WOMEN ONLY */}
                                {!this.state.calendarVisible && (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingBottom: 10,
                                        }}>
                                        <RegularText style={styles.contentText}>
                                            Women Only Activities:
                                        </RegularText>
                                        <View style={styles.leftItem}>
                                            <Switch
                                                style={styles.switch}
                                                trackColor={{
                                                    true: "#A9DCDF",
                                                    false: Colours.grey,
                                                }}
                                                thumbColor={Colours.grey}
                                                onChange={() =>
                                                    this.setState({
                                                        womenOnly: !this.state
                                                            .womenOnly,
                                                    })
                                                }
                                                value={this.state.womenOnly}
                                            />
                                        </View>
                                    </View>
                                )}
                                {/* PHYSICAL ACTIVITY */}
                                {!this.state.calendarVisible && (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingBottom: 10,
                                        }}>
                                        <RegularText style={styles.contentText}>
                                            Requires Physical Activity:
                                        </RegularText>
                                        <View style={styles.leftItem}>
                                            <Switch
                                                style={styles.switch}
                                                trackColor={{
                                                    true: "#A9DCDF",
                                                    false: Colours.grey,
                                                }}
                                                thumbColor={Colours.grey}
                                                onChange={() =>
                                                    this.setState({
                                                        physicalActivity: !this
                                                            .state
                                                            .physicalActivity,
                                                    })
                                                }
                                                value={
                                                    this.state.physicalActivity
                                                }
                                            />
                                        </View>
                                    </View>
                                )}
                                {/* LOCATION VISIBLE */}
                                {!this.state.calendarVisible && (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingBottom: 10,
                                        }}>
                                        <RegularText style={styles.contentText}>
                                            Full Location Visible:
                                        </RegularText>
                                        <View style={styles.leftItem}>
                                            <Switch
                                                style={styles.switch}
                                                trackColor={{
                                                    true: "#A9DCDF",
                                                    false: Colours.grey,
                                                }}
                                                thumbColor={Colours.grey}
                                                onChange={() =>
                                                    this.setState({
                                                        locationVisible: !this
                                                            .state
                                                            .locationVisible,
                                                    })
                                                }
                                                value={
                                                    this.state.locationVisible
                                                }
                                            />
                                        </View>
                                    </View>
                                )}
                                {!this.state.calendarVisible && (
                                    <Button
                                        size={15}
                                        title={"Update"}
                                        onPress={() => {
                                            this.setState({visible: false});
                                        }}
                                    />
                                )}
                            </ModalContent>
                        </Modal>
                    </View>

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
                    <this.state.display />
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
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

export default ActivitiesScreen;
