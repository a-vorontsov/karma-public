import React, {Component} from "react";
import {SafeAreaView, View} from "react-native";
import Styles from "../../styles/Styles";
import AttendeeButton from "../../components/activities/AttendeeButton";
import request from "superagent";
import {RegularText} from "../../components/text";
import {getAuthToken} from "../../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";

class Attendees extends Component {
    constructor(props) {
        super(props);

        this.state = {
            attendees: [],
        };
        this.getAttendees();
    }

    componentDidMount() {
        const {navigation} = this.props;
        this.willFocusListener = navigation.addListener(
            "willFocus",
            async () => {
                await this.getAttendees();
            },
        );
    }
    componentWillUnmount() {
        this.willFocusListener.remove();
    }

    getAttendees = async () => {
        const {activity} = this.props;
        const authToken = await getAuthToken();
        const response = await request
            .get(`${REACT_APP_API_URL}/event/${activity.id}/signUp`)
            .set("authorization", authToken)
            .then(res => {
                return res.body.data;
            })
            .catch(err => {
                console.log(err);
            });

        let attendees = [];
        Array.from(response.users).forEach(user => {
            if (user.confirmed) {
                attendees.push(user);
            }
        });

        this.setState({
            attendees,
        });
    };

    render() {
        const {activity} = this.props;
        const {attendees} = this.state;

        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph16}>
                    {attendees && attendees.length > 0 ? (
                        attendees.map(a => {
                            return (
                                <AttendeeButton
                                    user={a}
                                    key={a.userId}
                                    activity={activity}
                                />
                            );
                        })
                    ) : (
                        <RegularText>
                            Currently, there are no users attending your event!
                        </RegularText>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

export default Attendees;
