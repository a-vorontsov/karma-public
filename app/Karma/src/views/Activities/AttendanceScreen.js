import React, {Component} from "react";
import {SafeAreaView, View, ScrollView} from "react-native";
import Styles from "../../styles/Styles";
import AttendanceConfirmation from "../../components/activities/AttendanceConfirmation";
import request from "superagent";
import {SemiBoldText, SubTitleText} from "../../components/text";
import {getAuthToken} from "../../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";
import PageHeader from "../../components/PageHeader";
class AttendanceScreen extends Component {
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
        const activity = this.props.navigation.getParam("activity");
        const authToken = await getAuthToken();
        await request
            // ACCESS LIST OF ALL CONFIRMED ATTENDEES
            .get(`${REACT_APP_API_URL}/event/${activity.id}/signUp`)
            .set("authorization", authToken)
            .then(res => {
                const attendees = res.body.data.users || [];
                this.setState({
                    attendees: attendees.filter(
                        a => a.confirmed && a.attended === null,
                    ),
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    /**
     * When a sign up request is confirmed/rejected, refetch the requests
     */
    onSubmit = () => {
        this.getAttendees();
    };

    render() {
        const {attendees} = this.state;
        const activity = this.props.navigation.getParam("activity");
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Activity Attendance" />
                    {attendees && attendees.length > 0 && (
                        <SubTitleText>
                            Please mark if the attendees below have made it to
                            your event:
                        </SubTitleText>
                    )}
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, marginTop: 10, marginBottom: 100}}>
                        <View style={Styles.ph16}>
                            {attendees && attendees.length > 0 ? (
                                attendees.map(s => {
                                    return (
                                        <AttendanceConfirmation
                                            navigation={this.props.navigation}
                                            user={s}
                                            key={s.userId}
                                            activity={activity}
                                            onSubmit={this.onSubmit}
                                        />
                                    );
                                })
                            ) : (
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                    <SemiBoldText>
                                        Currently, there are no attendees
                                        confirmed for your event.
                                    </SemiBoldText>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default AttendanceScreen;
