import React from "react";
import {
    TouchableOpacity,
    View,
    Image,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import Slider from "@react-native-community/slider";
import {RegularText} from "../../components/text";
import Colours from "../../styles/Colours";
import Calendar from "../../components/Calendar";
import Styles from "../../styles/Styles";

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
            genderPreferences: "noPreferences",
            location: "anyLocation",
            type: "allTypes",
        };
        this.passUpState = this.passUpState.bind(this);
        if (Platform.OS === "android") {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    async componentDidMount() {
        const {filters} = this.props;
        await this.setState({
            distance: filters.maxDistance,
            availabilityStart: filters.availabilityStart,
            availabilityEnd: filters.availabilityEnd,
            genderPreferences: filters.genderPreferences || "noPreferences",
            location: filters.location || "anyLocation",
            type: filters.type || "allTypes",
        });
    }

    onInputChange = inputState => {
        this.setState({
            availabilityStart: inputState.selectedStartDate,
            availabilityEnd: inputState.selectedEndDate,
        });
    };

    _onFilterSelected(name, value) {
        this.setState({
            [name]: value,
        });
    }

    updateFilters() {
        this.setState({
            filters: {
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
            distanceExpanded,
            type,
            genderPreferences,
            location,
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
                            <View style={styles.rightItem}>
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
                                    startDate={
                                        this.props.filters.availabilityStart
                                    }
                                    endDate={this.props.filters.availabilityEnd}
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
                            <View style={styles.rightItem}>
                                <RegularText style={styles.contentText}>
                                    {filtersDisplay[this.state.type]}
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
                            disabled={type === "allTypes"}
                            onPress={() =>
                                this._onFilterSelected("type", "allTypes")
                            }
                            style={
                                type === "allTypes"
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    type === "allTypes"
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                All
                            </RegularText>
                        </TouchableOpacity>
                        {/* PHYSICAL ACTIVITIES */}
                        <TouchableOpacity
                            disabled={type === "physical"}
                            onPress={() =>
                                this._onFilterSelected("type", "physical")
                            }
                            style={
                                type === "physical"
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    type === "physical"
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                Physical
                            </RegularText>
                        </TouchableOpacity>
                        {/* NON PHYSICAL ACTIVITIES */}
                        <TouchableOpacity
                            disabled={type === "nonPhysical"}
                            onPress={() =>
                                this._onFilterSelected("type", "nonPhysical")
                            }
                            style={
                                type === "nonPhysical"
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    type === "nonPhysical"
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
                            <View style={styles.rightItem}>
                                <RegularText style={styles.contentText}>
                                    {filtersDisplay[this.state.location]}
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
                            disabled={location === "anyLocation"}
                            onPress={() =>
                                this._onFilterSelected(
                                    "location",
                                    "anyLocation",
                                )
                            }
                            style={
                                location === "anyLocation"
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    location === "anyLocation"
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                Any
                            </RegularText>
                        </TouchableOpacity>
                        {/* VISIBLE */}
                        <TouchableOpacity
                            disabled={location === "locationVisible"}
                            onPress={() =>
                                this._onFilterSelected(
                                    "location",
                                    "locationVisible",
                                )
                            }
                            style={
                                location === "locationVisible"
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    location === "locationVisible"
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                Visible
                            </RegularText>
                        </TouchableOpacity>
                        {/* NOT VISIBLE */}
                        <TouchableOpacity
                            disabled={location === "locationNotVisible"}
                            onPress={() =>
                                this._onFilterSelected(
                                    "location",
                                    "locationNotVisible",
                                )
                            }
                            style={
                                location === "locationNotVisible"
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    location === "locationNotVisible"
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
                            <View style={styles.rightItem}>
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
                                onSlidingComplete={val =>
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
                            <View style={styles.rightItem}>
                                <RegularText style={styles.contentText}>
                                    {
                                        filtersDisplay[
                                            this.state.genderPreferences
                                        ]
                                    }
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
                            disabled={genderPreferences === "noPreferences"}
                            onPress={() =>
                                this._onFilterSelected(
                                    "genderPreferences",
                                    "noPreferences",
                                )
                            }
                            style={
                                genderPreferences === "noPreferences"
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    genderPreferences === "noPreferences"
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                None
                            </RegularText>
                        </TouchableOpacity>
                        {/* WOMEN ONLY */}
                        <TouchableOpacity
                            disabled={genderPreferences === "womenOnly"}
                            onPress={() =>
                                this._onFilterSelected(
                                    "genderPreferences",
                                    "womenOnly",
                                )
                            }
                            style={
                                genderPreferences === "womenOnly"
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    genderPreferences === "womenOnly"
                                        ? styles.categoryTextSelected
                                        : styles.categoryText
                                }>
                                Women-Only
                            </RegularText>
                        </TouchableOpacity>
                        {/* All Genders Allowed */}
                        <TouchableOpacity
                            disabled={genderPreferences === "allGenders"}
                            onPress={() =>
                                this._onFilterSelected(
                                    "genderPreferences",
                                    "allGenders",
                                )
                            }
                            style={
                                genderPreferences === "allGenders"
                                    ? styles.categoryBtnSelected
                                    : styles.categoryBtn
                            }>
                            <RegularText
                                style={
                                    genderPreferences === "allGenders"
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
                        {"Apply"}
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
    rightItem: {
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
