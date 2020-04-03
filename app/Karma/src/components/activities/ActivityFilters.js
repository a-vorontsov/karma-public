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
import Slider from "@react-native-community/slider";
import {RegularText} from "../../components/text";
import Colours from "../../styles/Colours";
import Calendar from "../../components/Calendar";
import {Button} from "../../components/buttons";
import Styles from "../../styles/Styles";

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
};
export default class ActivityFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            distance: 90,
            availabilityStart: null,
            availabilityEnd: null,
            filters: {},
            typesExpanded: false,
            gendersExpanded: false,
            locationExpanded: false,
            distanceExpanded: false,
            availabilityExpanded: false,
            //Gender
            genderPreferences: "None",
            noPreferences: true,
            womenOnly: false,
            allGenders: false,
            //Location
            location: "Any",
            locationVisible: false,
            locationNotVisible: false,
            anyLocation: true,
            //Types
            type: "All",
            allTypes: true,
            physical: false,
            nonPhysical: false,
        };
        this.passUpState = this.passUpState.bind(this);
        if (Platform.OS === "android") {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    async componentDidMount() {
        const {filters} = this.props;
        const {booleanFilters} = filters;
        if (booleanFilters) {
            await this.setState({
                womenOnly: booleanFilters.includes("women_only"),
                allGenders: booleanFilters.includes("!women_only"),
                locationVisible: booleanFilters.includes("address_visible"),
                locationNotVisible: booleanFilters.includes("!address_visible"),
                physical: booleanFilters.includes("physical"),
                nonPhysical: booleanFilters.includes("!physical"),
            });
            this.setState({
                noPreferences: !this.state.womenOnly && !this.state.allGenders,
                allTypes: !this.state.physical && !this.state.nonPhysical,
                anyLocation:!this.state.locationVisible && !this.state.locationNotVisible,
            });
        }
        this.setState({
            distance: filters.maxDistance,
            availabilityStart: filters.availabilityStart,
            availabilityEnd: filters.availabilityEnd,
            genderPreferences: filters.genderPreferences || "None",
            location: filters.location || "Any",
            type: filters.type || "All",
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
            genderPreferences: filtersDisplay[name],
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
        const booleanFilters = [];
        if (!this.state.noPreferences) {
            this.state.womenOnly && booleanFilters.push("women_only");
            this.state.allGenders && booleanFilters.push("!women_only");
        }
        if (!this.state.anyLocation) {
            this.state.locationVisible && booleanFilters.push("address_visible");
            this.state.locationNotVisible && booleanFilters.push("!address_visible");
        }
        if (!this.state.allTypes) {
            this.state.physical && booleanFilters.push("physical");
            this.state.nonPhysical && booleanFilters.push("!physical");
        }
        this.setState({
            filters: {
                booleanFilters: booleanFilters,
                maxDistance: this.state.distance,
                availabilityStart: this.state.availabilityStart,
                availabilityEnd: this.state.availabilityEnd,
                genderPreferences: this.state.genderPreferences,
                type: this.state.type,
                location: this.state.location,
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
            availabilityExpanded,
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
                <RegularText
                    style={{
                        fontWeight: "bold",
                        fontSize: 19,
                        color: Colours.darkGrey,
                    }}>
                    Filters:
                </RegularText>
                {/* AVAILABILITY */}
                <View style={styles.btnTextHolder}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                            this.changeLayout("availabilityExpanded")
                        }
                        style={styles.Btn}>
                        <View style={styles.header}>
                            <RegularText style={styles.btnText}>
                                Availability
                            </RegularText>
                            <View style={styles.leftItem}>
                                <Image
                                    source={icons.calendar}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        resizeMode: "contain",
                                    }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            ...styles.contentBox,
                            height: availabilityExpanded ? null : 0,
                        }}>
                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                            <View style={{paddingVertical: 10}}>
                                <Calendar
                                    onChange={this.onInputChange}
                                    startDate={this.state.availabilityStart}
                                    endDate={this.state.availabilityEnd}
                                />
                            </View>
                        </View>
                    </View>
                </View>
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
                                    {this.state.genderPreferences}
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
                <TouchableOpacity
                    style={{
                        ...Styles.roundButton,
                        width: "100%",
                        bottom: 0,
                        marginTop: 15,
                    }}
                    onPress={this.passUpState}
                    activeOpacity={0.9}>
                    <RegularText
                        style={{
                            ...Styles.buttonText,
                            ...Styles.white,
                        }}>
                        {"Update"}
                    </RegularText>
                </TouchableOpacity>
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
