import React, {Component} from "react";
import {
    TouchableOpacity,
    View,
    Image,
    Switch,
    Dimensions,
    ScrollView,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import CheckBox from "react-native-check-box";
import Slider from "@react-native-community/slider";
import {RegularText} from "../../components/text";
import Colours from "../../styles/Colours";
import Calendar from "../../components/Calendar";
import {Button} from "../../components/buttons";
import BoldText from "../text/BoldText";

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
            womenOnly: false,
            locationVisible: false,
            physicalActivity: false,
            distance: 90,
            calendarVisible: false,
            availabilityStart: null,
            availabilityEnd: null,
            filters: {},
            expanded: false,
        };
        this.passUpState = this.passUpState.bind(this);
        if (Platform.OS === "android") {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    componentDidMount() {
        const {filters} = this.props;
        if(filters.booleanFilters){
            this.setState({
                womenOnly: filters.booleanFilters.includes("women_only"),
                locationVisible: filters.booleanFilters.includes("address_visible"),
                physicalActivity: filters.booleanFilters.includes("physical"),
            });
        }
        this.setState({
            distance: filters.maxDistance,
            availabilityStart: filters.availabilityStart,
            availabilityEnd: filters.availabilityEnd,
        });
    }

    onInputChange = inputState => {
        this.setState({
            availabilityStart: inputState.selectedStartDate,
            availabilityEnd: inputState.selectedEndDate,
        });
    };

    _onCategorySelected(name) {
        this.setState({
            [name]: !this.state[name],
        });
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
    async passUpState() {
        console.log("Passing up state now.");
        await this.updateFilters();
        const {filters} = this.state;
        this.props.onUpdateFilters({
            filters,
        });
    }
    changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({expanded: !this.state.expanded});
    };

    render() {
        return (
            <View>
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
                {!this.state.calendarVisible && (
                    <View style={styles.btnTextHolder}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={this.changeLayout}
                            style={styles.Btn}>
                            <RegularText style={styles.btnText}>
                                Category
                            </RegularText>
                        </TouchableOpacity>
                        <View
                            style={{
                                height: this.state.expanded ? null : 0,
                                overflow: "hidden",
                                paddingHorizontal: 15,
                            }}>
                            {/* WOMEN ONLY */}
                            <TouchableOpacity
                                onPress={() =>
                                    this._onCategorySelected("womenOnly")
                                }
                                style={
                                    this.state.womenOnly
                                        ? styles.categoryBtnSelected
                                        : styles.categoryBtn
                                }>
                                <RegularText
                                    style={
                                        this.state.womenOnly
                                            ? styles.categoryTextSelected
                                            : styles.categoryText
                                    }>
                                    Women Only
                                </RegularText>
                            </TouchableOpacity>
                            {/* PHYSICAL ACTIVITY */}
                            <TouchableOpacity
                                onPress={() =>
                                    this._onCategorySelected("physicalActivity")
                                }
                                style={
                                    this.state.physicalActivity
                                        ? styles.categoryBtnSelected
                                        : styles.categoryBtn
                                }>
                                <RegularText
                                    style={
                                        this.state.physicalActivity
                                            ? styles.categoryTextSelected
                                            : styles.categoryText
                                    }>
                                    Physical
                                </RegularText>
                            </TouchableOpacity>
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
    contentText: {
        fontSize: 15,
        color: Colours.grey,
        paddingVertical: 15,
    },
    leftItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    text: {
        fontSize: 17,
        color: "black",
        padding: 10,
    },

    btnText: {
        color: Colours.darkGrey,
        fontSize: 19,
        fontWeight: "bold",
    },

    btnTextHolder: {
        borderRadius: 7,
        borderColor: "rgba(0,0,0,0.5)",
        backgroundColor: Colours.lightestGrey,
    },

    Btn: {
        borderRadius: 7,
        padding: 10,
        backgroundColor: Colours.lightestGrey,
    },
    categoryBtnSelected: {
        backgroundColor: Colours.white,
        borderRadius: 7,
        borderLeftWidth: 4,
        borderLeftColor: Colours.cyan,
        paddingLeft: 20,
        paddingVertical: 10,
        marginBottom: 10,
    },
    categoryBtn: {
        backgroundColor: Colours.lightestGrey,
        borderRadius: 7,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 16,
        color: Colours.grey,
    },
    categoryTextSelected: {
        fontSize: 16,
        color: Colours.grey,
        fontWeight: "bold",
    },
});
