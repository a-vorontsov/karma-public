import React, {Component} from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";
import {getAuthToken} from "../../util/credentials";
const {height: SCREEN_HEIGHT} = Dimensions.get("window");
import {REACT_APP_API_URL} from "react-native-dotenv";
import Colours from "../../styles/Colours";
const request = require("superagent");

class ActivitiesGoingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmed: [],
            pending: [],
            isRefreshing: false,
            eventsToggle: true,
        };
        this.onRefresh = this.onRefresh.bind(this);
    }
    async componentDidMount() {
        await this.fetchAllActivities();
    }

    async fetchAllActivities() {
        const authToken = await getAuthToken();
        request
            .get(`${REACT_APP_API_URL}/event/going`)
            .set("authorization", authToken)
            .then(result => {
                console.log(result.body.message);
                const activities = result.body.data.events || [];
                console.log(activities.length);
                const confirmed = [];
                const pending = [];
                activities.forEach(a =>
                    a.confirmed ? confirmed.push(a) : pending.push(a),
                );
                this.setState({
                    confirmed: confirmed,
                    pending: pending,
                });
            })
            .catch(er => {
                console.log(er);
            });
    }

    onRefresh() {
        this.setState({isRefreshing: true}); // true isRefreshing flag for enable pull to refresh indicator
        this.fetchAllActivities()
            .then(() => {
                this.setState({
                    isRefreshing: false,
                });
            })
            .catch(err => {
                console.log(err);
                Alert.alert(
                    "An error occurred",
                    "Cannot refresh at the moment.",
                );
                this.setState({
                    isRefreshing: false,
                });
            });
    }

    render() {
        return (
            <View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "flex-start",
                    }}>
                    <TouchableOpacity
                        disabled={this.state.eventsToggle}
                        onPress={() =>
                            this.setState({
                                eventsToggle: !this.state.eventsToggle,
                            })
                        }
                        style={
                            this.state.eventsToggle
                                ? styles.tabSelected
                                : styles.tab
                        }>
                        <RegularText
                            style={
                                this.state.eventsToggle
                                    ? styles.subHeaderSelected
                                    : styles.subHeader
                            }>
                            Confirmed
                        </RegularText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={!this.state.eventsToggle}
                        onPress={() =>
                            this.setState({
                                eventsToggle: !this.state.eventsToggle,
                            })
                        }
                        style={
                            !this.state.eventsToggle
                                ? styles.tabSelected
                                : styles.tab
                        }>
                        <RegularText
                            style={
                                !this.state.eventsToggle
                                    ? styles.subHeaderSelected
                                    : styles.subHeader
                            }>
                            Pending
                        </RegularText>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh}
                        />
                    }>
                    <View
                        style={{
                            flex: 1,
                            marginTop: 10,
                            marginBottom: 220,
                            minHeight: SCREEN_HEIGHT,
                        }}>
                        {this.state.confirmed.length > 0 &&
                            this.state.eventsToggle &&
                            this.state.confirmed.map(activity => {
                                return (
                                    <ActivityDisplayCard
                                        activity={activity}
                                        key={activity.eventId}
                                        signedup={true}
                                        isOrganisation={
                                            this.props.isOrganisation
                                        }
                                    />
                                );
                            })}
                        {this.state.confirmed.length <= 0 &&
                            this.state.eventsToggle && (
                                <View style={{...Styles.ph24, marginTop: 10}}>
                                    <RegularText>
                                        No organizations have confirmed your
                                        attendance to an event yet. Please try
                                        again later. (Pull to Refresh)
                                    </RegularText>
                                </View>
                            )}
                        {this.state.pending.length > 0 &&
                            !this.state.eventsToggle &&
                            this.state.pending.map(activity => {
                                return (
                                    <ActivityDisplayCard
                                        activity={activity}
                                        key={activity.eventId}
                                        signedup={true}
                                        isOrganisation={
                                            this.props.isOrganisation
                                        }
                                    />
                                );
                            })}
                        {this.state.pending.length <= 0 &&
                            !this.state.eventsToggle && (
                                <View style={{...Styles.ph24, marginTop: 10}}>
                                    <RegularText>
                                        You have no pending sign up requests
                                        (Pull to Refresh)
                                    </RegularText>
                                </View>
                            )}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    tabSelected: {
        alignSelf: "center",
        justifyContent: "center",
        width: "50%",
        borderBottomWidth: 3,
        borderBottomColor: Colours.blue,
        paddingVertical: 5,
    },
    tab: {
        alignSelf: "center",
        justifyContent: "center",
        width: "50%",
        paddingVertical: 5,
    },
    subHeader: {
        fontSize: 14,
        color: Colours.lightGrey,
        fontWeight: "500",
        alignSelf: "center",
    },
    subHeaderSelected: {
        fontSize: 14,
        color: Colours.grey,
        fontWeight: "500",
        alignSelf: "center",
    },
});
export default ActivitiesGoingScreen;
