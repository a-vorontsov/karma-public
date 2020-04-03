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
const filtersDisplay = {
    noPreferences: "None",
    womenOnly: "Women Only",
    allGenders: "All Allowed",
    locationVisible: "Visible",
    locationNotVisible: "Not Visible",
    anyLocation: "Any",
    allTypes: "All",
    physical: "Physical",
    nonPhysical: "Non-Physical",
}
export default class ActivityFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noPreferences: true,
            womenOnly: false,
            allGenders: false,
            locationVisible: false,
            locationNotVisible: false,
            anyLocation: true,
            type: "All",
            gender: "None",
            location: "Any",
            allTypes: true,
            physical: false,
            nonPhysical: false,
            distance: 90,
            calendarVisible: false,
            availabilityStart: null,
            availabilityEnd: null,
            filters: {},
            typesExpanded: false,
            gendersExpanded: false,
            locationExpanded: false,
            distanceExpanded: false,
        };
        this.passUpState = this.passUpState.bind(this);
        if (Platform.OS === "android") {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    componentDidMount() {
        const {filters} = this.props;
        if (filters.booleanFilters) {
            this.setState({
                womenOnly: filters.booleanFilters.includes("women_only"),
                locationVisible: filters.booleanFilters.includes(
                    "address_visible",
                ),
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

    setListStatesToFalse(listName) {
        switch (listName) {
            case "preferences":
                this.setState({
                    noPreferences: false,
                    womenOnly: false,
                    allGenders: false,
                });
                break;
            case "types": {
                this.setState({
                    allTypes: false,
                    physical: false,
                    nonPhysical: false,
                });
                break;
            }
            case "location": {
                this.setState({
                    anyLocation: false,
                    locationVisible: false,
                    locationNotVisible: false,
                });
                break;
            }
        }
    }

    _onTypeSelected(name) {
        this.setListStatesToFalse("types");
        this.setState({
            [name]: !this.state[name],
            type: filtersDisplay[name],
        });
    }
    _onGenderSelected(name) {
        this.setListStatesToFalse("preferences");
        this.setState({
            [name]: !this.state[name],
            gender: filtersDisplay[name],
        });
    }

    _onLocationSelected(name) {
        this.setListStatesToFalse("location");
        this.setState({
            [name]: !this.state[name],
            location: filtersDisplay[name],
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
    changeLayout = name => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({[name]: !this.state[name]});
    };

    render() {
        const {
            gendersExpanded,
            typesExpanded,
            locationExpanded,
            noPreferences,
            womenOnly,
            allGenders,
            allTypes,
            physical,
            nonPhysical,
            distanceExpanded,
            locationVisible,
            locationNotVisible,
            anyLocation,
        } = this.state;
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
                {/* ACTIVITY TYPES */}
                <View style={styles.btnTextHolder}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => this.changeLayout("typesExpanded")}
                        style={styles.Btn}>
                        <View style={styles.header}>
                            <RegularText style={styles.btnText}>
                                Activity Type
                            </RegularText>
                            <View style={styles.leftItem}>
                                <RegularText style={styles.contentText}>
                                    {this.state.type}
                                </RegularText>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            ...styles.contentBox,
                            height: typesExpanded ? null : 0,
                        }}>
                        {/* All */}
                        <TouchableOpacity
                            disabled={allTypes}
                            onPress={() => this._onTypeSelected("allTypes")}
                            style={
                                allTypes
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    this.state.allTypes
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                All
                            </RegularText>
                        </TouchableOpacity>
                        {/* PHYSICAL ACTIVITIES */}
                        <TouchableOpacity
                            disabled={physical}
                            onPress={() => this._onTypeSelected("physical")}
                            style={
                                physical
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    physical
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                Physical
                            </RegularText>
                        </TouchableOpacity>
                        {/* NON PHYSICAL ACTIVITIES */}
                        <TouchableOpacity
                            disabled={nonPhysical}
                            onPress={() => this._onTypeSelected("nonPhysical")}
                            style={
                                nonPhysical
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    nonPhysical
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                Non-Physical
                            </RegularText>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* LOCATION */}
                <View style={styles.btnTextHolder}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => this.changeLayout("locationExpanded")}
                        style={styles.Btn}>
                        <View style={styles.header}>
                            <RegularText style={styles.btnText}>
                                Location
                            </RegularText>
                            <View style={styles.leftItem}>
                                <RegularText style={styles.contentText}>
                                    {this.state.location}
                                </RegularText>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            ...styles.contentBox,
                            height: locationExpanded ? null : 0,
                        }}>
                        {/* ANY */}
                        <TouchableOpacity
                            disabled={anyLocation}
                            onPress={() =>
                                this._onLocationSelected("anyLocation")
                            }
                            style={
                                anyLocation
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    anyLocation
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                Any
                            </RegularText>
                        </TouchableOpacity>
                        {/* VISIBLE */}
                        <TouchableOpacity
                            disabled={locationVisible}
                            onPress={() =>
                                this._onLocationSelected("locationVisible")
                            }
                            style={
                                locationVisible
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    locationVisible
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                Visible
                            </RegularText>
                        </TouchableOpacity>
                        {/* NOT VISIBLE */}
                        <TouchableOpacity
                            disabled={locationNotVisible}
                            onPress={() =>
                                this._onLocationSelected("locationNotVisible")
                            }
                            style={
                                locationNotVisible
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    locationNotVisible
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                Not Visible
                            </RegularText>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* MAX DISTANCE */}
                <View style={styles.btnTextHolder}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => this.changeLayout("distanceExpanded")}
                        style={styles.Btn}>
                        <View style={styles.header}>
                            <RegularText style={styles.btnText}>
                                Max Distance
                            </RegularText>
                            <View style={styles.leftItem}>
                                <RegularText style={styles.contentText}>
                                    {this.state.distance} Miles
                                </RegularText>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            ...styles.contentBox,
                            height: distanceExpanded ? null : 0,
                        }}>
                        <View>
                            <Slider
                                style={styles.slider}
                                value={this.state.distance}
                                minimumValue={0}
                                maximumValue={100}
                                step={1}
                                thumbTintColor={Colours.blue}
                                minimumTrackTintColor="#A9DCDF"
                                onValueChange={val =>
                                    this.setState({
                                        distance: val,
                                    })
                                }
                            />
                        </View>
                    </View>
                </View>
                {/* GENDER PREFERENCES */}
                <View style={styles.btnTextHolder}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => this.changeLayout("gendersExpanded")}
                        style={styles.Btn}>
                        <View style={styles.header}>
                            <RegularText style={styles.btnText}>
                                Gender Preferences
                            </RegularText>
                            <View style={styles.leftItem}>
                                <RegularText style={styles.contentText}>
                                    {this.state.gender}
                                </RegularText>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            ...styles.contentBox,
                            height: gendersExpanded ? null : 0,
                        }}>
                        {/* No Preferences */}
                        <TouchableOpacity
                            disabled={noPreferences}
                            onPress={() =>
                                this._onGenderSelected("noPreferences")
                            }
                            style={
                                noPreferences
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    noPreferences
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                None
                            </RegularText>
                        </TouchableOpacity>
                        {/* WOMEN ONLY */}
                        <TouchableOpacity
                            disabled={womenOnly}
                            onPress={() => this._onGenderSelected("womenOnly")}
                            style={
                                womenOnly
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    womenOnly
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                Women-Only
                            </RegularText>
                        </TouchableOpacity>
                        {/* All Genders Allowed */}
                        <TouchableOpacity
                            disabled={allGenders}
                            onPress={() => this._onGenderSelected("allGenders")}
                            style={
                                allGenders
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    allGenders
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                All Genders Allowed
                            </RegularText>
                        </TouchableOpacity>
                    </View>
                </View>
                <Button size={15} title={"Update"} onPress={this.passUpState} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contentText: {
        fontSize: 15,
        color: Colours.grey,
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
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    btnText: {
        color: Colours.darkGrey,
        fontSize: 16,
        fontWeight: "bold",
    },

    btnTextHolder: {
        borderRadius: 7,
        borderColor: "rgba(0,0,0,0.5)",
        backgroundColor: Colours.lightestGrey,
        marginTop: 10,
    },
    Btn: {
        borderRadius: 7,
        padding: 10,
        backgroundColor: Colours.lightestGrey,
    },
    contentBox: {
        overflow: "hidden",
        paddingHorizontal: 15,
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
        fontSize: 13,
        color: Colours.grey,
    },
    categoryTextSelected: {
        fontSize: 13,
        color: Colours.grey,
        fontWeight: "bold",
    },
});
