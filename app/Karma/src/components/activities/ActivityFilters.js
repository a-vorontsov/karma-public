import React from "react";
import {
    TouchableOpacity,
    View,
    Image,
    Switch,
    Dimensions,
    ScrollView,
    StyleSheet,
} from "react-native";
import CheckBox from "react-native-check-box";
import Slider from "@react-native-community/slider";
import Modal, {ModalContent} from "react-native-modals";
import {RegularText} from "../../components/text";
import Colours from "../../styles/Colours";
import Calendar from "../../components/Calendar";
import {Button} from "../../components/buttons";
import {getCalendarPerms, askCalendarPerms} from "../../util/calendar";

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get("window");
const formWidth = 0.8 * SCREEN_WIDTH;

const icons = {
    filter: require("../../assets/images/general-logos/filter.png"),
    calendar: require("../../assets/images/general-logos/calendar-dark.png"),
};
export default class ActivityFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            womenOnly: true,
            locationVisible: false,
            physicalActivity: false,
            distance: 90,
            calendarVisible: false,
            availabilityStart: null,
            availabilityEnd: null,
            filtersEnabled: false,
            filters: [],
        };
        this.passUpState = this.passUpState.bind(this);
    }

    updateFilters() {
        this.setState({
            filters: {
                booleanFilters: [
                    ...(this.state.womenOnly
                        ? ["women_only"]
                        : ["!women_only"]),
                    ...(this.state.physicalActivity
                        ? ["physical"]
                        : ["!physical"]),
                    ...(this.state.locationVisible
                        ? ["address_visible"]
                        : ["!address_visible"]),
                ],
                maxDistance: this.state.distance,
                availabilityStart: this.state.availabilityStart,
                availabilityEnd: this.state.availabilityEnd,
            },
        });
    }
    passUpState() {
        console.log("Passing up state now.")
        this.updateFilters();
        const {filters} = this.state;
        this.props.onUpdateFilters({
            filters,
        });
    }

    render() {
        return (
            <View>
                {!this.state.calendarVisible && (
                    <View>
                        <CheckBox
                            style={{
                                flex: 1,
                                padding: 13,
                            }}
                            onClick={() => {
                                this.setState({
                                    filtersEnabled: !this.state.filtersEnabled,
                                });
                            }}
                            isChecked={this.state.filtersEnabled}
                            rightText={"Enable filtering?"}
                            rightTextStyle={{
                                fontSize: 18,
                                color: Colours.grey,
                                paddingVertical: 30,
                            }}
                        />
                    </View>
                )}
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
                            <Calendar
                                onChange={this.onInputChange}
                                startDate={this.state.availabilityStart}
                                endDate={this.state.availabilityEnd}
                            />
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
                            value={this.state.distance}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            thumbTintColor={Colours.blue}
                            minimumTrackTintColor="#A9DCDF"
                            onSlidingComplete={val =>
                                this.setState({
                                    distance: val,
                                })
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
                                        womenOnly: !this.state.womenOnly,
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
                                        physicalActivity: !this.state
                                            .physicalActivity,
                                    })
                                }
                                value={this.state.physicalActivity}
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
                                        locationVisible: !this.state
                                            .locationVisible,
                                    })
                                }
                                value={this.state.locationVisible}
                            />
                        </View>
                    </View>
                )}
                {!this.state.calendarVisible && (
                    <Button
                        size={15}
                        title={"Update"}
                        onPress={this.passUpState}
                    />
                )}
            </View>
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
