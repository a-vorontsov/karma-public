import React, {Component} from "react";
import {View} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";

const request = require("superagent");

class ActivitiesGoingScreen extends Component {
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

    fetchAllActivities() {
        request
            .get("http://localhost:8000/event/going")
            .query({userId: 76})
            .then(result => {
                console.log(result.body.data);
                let activities = result.body.data.events;
                this.setState({
                    activities,
                });
            })
            .catch(er => {
                console.log(er);
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
                                key={activity.id}
                            />
                        );
                    })
                ) : (
                    <View style={Styles.ph24}>
                        <RegularText>
                            You have not selected any activities to attend (Refresh)
                        </RegularText>
                    </View>
                )}
            </View>
        );
    }
}

export default ActivitiesGoingScreen;
