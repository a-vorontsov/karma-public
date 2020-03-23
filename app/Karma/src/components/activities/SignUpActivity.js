import React from "react";
import {SubTitleText, RegularText, BoldText, FadedText} from "../text";
import {TransparentButton, Button} from "../buttons";
import {View, Image} from "react-native";
import Toast from "react-native-simple-toast";
import RNCalendarEvents from "react-native-calendar-events";
import Styles from "../../styles/Styles";
import {getCalendarPerms, askCalendarPerms} from "../../util/calendar";
import {getAuthToken} from "../../util/credentials";
const moment = require("moment");
const request = require("superagent");
const icons = {
    location: require("../../assets/images/general-logos/location-logo.png"),
    calendar: require("../../assets/images/general-logos/calendar-light.png"),
};

export default class SignUpActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inCalendar: false,
        };
        this.confirmSignUp = this.confirmSignUp.bind(this);
        this.cancelSignUp = this.cancelSignUp.bind(this);
        this.existsInCalendar = this.existsInCalendar.bind(this);
        this.saveToCalendar = this.saveToCalendar.bind(this);
        this.removeFromCalendar = this.removeFromCalendar.bind(this);
    }
    async componentDidMount() {
        const perms = await getCalendarPerms();
        if (perms === "authorized") {
            const inCalendar = await this.existsInCalendar();
            this.setState({
                inCalendar,
            });
        }
    }
    async confirmSignUp() {
        const {activity, onConfirm, onError} = this.props;
        const authToken = await getAuthToken();
        const eventId = activity.eventId;
        request
            .post(`http://localhost:8000/event/${eventId}/signUp`)
            .set("authorization", authToken)
            .send({
                confirmed: true,
            })
            .then(() => {
                Toast.showWithGravity(
                    "You have successfully signed up!",
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                onConfirm();
            })
            .catch(() => {
                onError(
                    "There has been an error with signing up to this activity.",
                    "Please try again later or contact us if this issue persists.",
                );
            });
    }
    async cancelSignUp() {
        const {activity, onConfirm, onError} = this.props;
        const authToken = await getAuthToken();
        const eventId = activity.eventid ? activity.eventid : activity.eventId; //TODO fix lack of camelcase
        request
            .post(`http://localhost:8000/event/${eventId}/signUp/update`)
            .set("authorization", authToken)
            .send({
                confirmed: false,
            })
            .then(res => {
                Toast.showWithGravity(
                    "You have successfully signed out of the activity.",
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                onConfirm();
            })
            .catch(() => {
                onError(
                    "There has been an error with signing out of this activity.",
                    "Please try again later or contact us if this issue persists.",
                );
            });
    }
    async existsInCalendar() {
        const {activity} = this.props;
        const events = await RNCalendarEvents.fetchAllEvents(
            activity.date,
            activity.date,
        );
        const existEvent = events.some(event => {
            return event.title === activity.name;
        });
        return existEvent;
    }
    async saveToCalendar() {
        const perms = await getCalendarPerms();
        if (perms === "authorized") {
            const {activity, onError} = this.props;
            try {
                await RNCalendarEvents.saveEvent(activity.name, {
                    description: activity.content,
                    notes: activity.content,
                    startDate: activity.date,
                    endDate: activity.date,
                    location: `${activity.address1} ${activity.address2}, ${
                        activity.city
                    }, ${activity.postcode}`,
                });
                Toast.showWithGravity(
                    "You have successfully added this activity to your calendar!",
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                const inCalendar = await this.existsInCalendar();
                this.setState({
                    inCalendar,
                });
            } catch (err) {
                onError(
                    "There has been an error with adding this activity to your calendar.",
                    "Please try again later or contact us if this issue persists.",
                );
            }
        } else {
            await askCalendarPerms();
        }
    }
    async removeFromCalendar() {
        const perms = await getCalendarPerms();
        if (perms === "authorized") {
            const {activity, onError} = this.props;
            const events = await RNCalendarEvents.fetchAllEvents(
                activity.date,
                activity.date,
            );
            const existEvent = events.find(event => {
                return event.title === activity.name;
            });
            try {
                await RNCalendarEvents.removeEvent(existEvent.id);
                Toast.showWithGravity(
                    "You have successfully removed this activity from your calendar!",
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                const inCalendar = await this.existsInCalendar();
                this.setState({
                    inCalendar,
                });
            } catch (err) {
                onError(
                    "There has been an error with removing this activity from your calendar.",
                    "Please try again later or contact us if this issue persists.",
                );
            }
        }
    }
    render() {
        const {activity, signedUp} = this.props;
        const {inCalendar} = this.state;
        return (
            <View style={Styles.ph8}>
                <SubTitleText>Almost signed up!</SubTitleText>
                <RegularText style={Styles.pb16}>
                    {activity.content}
                </RegularText>
                <View style={[Styles.pv8, {flexDirection: "row"}]}>
                    <Image
                        source={icons.calendar}
                        style={{
                            height: 24,
                            width: 24,
                            resizeMode: "contain",
                            marginRight: 8,
                        }}
                    />
                    <View>
                        <BoldText>
                            {moment(activity.date).format("dddd, Do MMMM YYYY")}
                        </BoldText>
                        <FadedText>
                            {moment(activity.date).format("LT")}
                        </FadedText>
                    </View>
                </View>
                <View style={[Styles.pv8, {flexDirection: "row"}]}>
                    <Image
                        source={icons.location}
                        style={{
                            height: 24,
                            width: 24,
                            resizeMode: "contain",
                            marginRight: 8,
                        }}
                    />
                    <BoldText>
                        {activity.address1} {activity.address2}, {activity.city}
                        , {activity.postcode}
                    </BoldText>
                </View>
                <View style={Styles.pv8}>
                    {inCalendar ? (
                        <TransparentButton
                            title="Remove from Calendar"
                            red
                            onPress={this.removeFromCalendar}
                        />
                    ) : (
                        <TransparentButton
                            title="Add to Calendar"
                            onPress={this.saveToCalendar}
                        />
                    )}
                </View>
                <View style={Styles.pv8}>
                    {signedUp ? (
                        <TransparentButton
                            title="Cancel"
                            red
                            onPress={this.cancelSignUp}
                        />
                    ) : (
                        <Button title="Confirm" onPress={this.confirmSignUp} />
                    )}
                </View>
            </View>
        );
    }
}
