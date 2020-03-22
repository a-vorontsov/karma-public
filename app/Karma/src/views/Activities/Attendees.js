import React, {Component} from "react";
import {SafeAreaView, View} from "react-native";
import Styles from "../../styles/Styles";
import AttendeeButton from "../../components/activities/AttendeeButton";
import {getData} from "../../util/GetCredentials";
import request from "superagent";
import {RegularText} from "../../components/text";

class Attendees extends Component {
    constructor(props) {
        super(props);

        this.state = {
            attendees: [],
            attendeeIds: [],
        };
        this.fetchAttendeeInfo();
    }

    static navigationOptions = {
        headerShown: false,
    };

    /**
     * Fetches each volunteer's profile.
     * This is used to then get the full name and email of each volunteer.
     */
    fetchAttendeeInfo = async () => {
        const {activity} = this.props;
        const credentials = await getData();

        let volunteers = Array.from(activity.volunteers);
        let attendees = [];
        let attendeeIds = [];
        for (let i = 0; i < volunteers.length; ++i) {
            const volunteerProfile = await request
                .get("http://localhost:8000/profile/")
                .query({userId: volunteers[i]})
                .send({authToken: credentials.password})
                .then(res => {
                    return res.body.data;
                });
            attendees.push(volunteerProfile);
            attendeeIds.push(volunteers[i]);
        }

        this.setState({
            attendees: attendees,
            attendeeIds: attendeeIds,
        });
    };

    _renderAttendees = () => {
        const {attendees, attendeeIds} = this.state;
        return attendees.map((user, idx) => {
            return (
                <AttendeeButton
                    profile={user}
                    attendeeId={attendeeIds[idx]}
                    key={attendeeIds[idx]}
                />
            );
        });
    };

    render() {
        const isEmpty = this.state.attendees.length === 0;
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                {isEmpty ? (
                    <View style={{alignSelf: "center"}}>
                        <RegularText>
                            Currently, there are no volunteers signed up!
                        </RegularText>
                    </View>
                ) : (
                    <View style={Styles.ph16}>{this._renderAttendees()}</View>
                )}
            </SafeAreaView>
        );
    }
}

export default Attendees;
