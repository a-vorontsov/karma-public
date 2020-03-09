import React, {Component} from "react";
import {View} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";

const request = require("superagent");

class ActivitiesFavouritesScreen extends Component {
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
            .get("http://localhost:8000/event")
            .query({userId: 1, Page: 1, pageSize: 2})
            .then(result => {
                console.log(result.body.data);
                let activities = result.body.data;
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
                {this.state.activities.map(activity => {
                    return (
                        <ActivityDisplayCard
                            activity={activity}
                            key={activity.id}
                        />
                    );
                })}
            </View>
        );
    }
}

export default ActivitiesFavouritesScreen;
