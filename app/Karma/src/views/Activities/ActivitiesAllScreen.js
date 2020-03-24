import React, {Component} from "react";
import {View, Alert} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";
import {getAuthToken} from "../../util/credentials";

const request = require("superagent");

class ActivitiesAllScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
        };
        this.fetchAllActivities();
    }

    static navigationOptions = {
        headerShown: false,
    };

    async fetchAllActivities() {
        const authToken = await getAuthToken();
        request
            .get("http://localhost:8000/event")
            .set("authorization", authToken)
            .query({Page: 1, pageSize: 2})
            .then(result => {
                let activities = result.body.data.events;
                this.setState({
                    activities,
                });
            })
            .catch(er => {
                console.log(er);
                Alert.alert("No activities could be found!");
            });
    }

    render() {
        return (
            <View>
                {this.state.activities.length > 0 ? (
                    this.state.activities.map(activity => {
                        return (
                            <ActivityDisplayCard
                                activity={activity}
                                key={activity.eventId}
                                signedup={activity.going}
                            />
                        );
                    })
                ) : (
                    <View style={Styles.ph24}>
                        <RegularText>
                            Could not find any activities (Refresh)
                        </RegularText>
                    </View>
                )}
            </View>
        );
    }
}

export default ActivitiesAllScreen;
