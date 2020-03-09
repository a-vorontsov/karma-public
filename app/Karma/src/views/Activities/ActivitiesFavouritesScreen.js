import React, {Component} from "react";
import {TextInput, Text, View} from "react-native";
import {RegularText} from "../../components/text";
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
            .get("http://localhost:8000/event/favourites")
            .query({userId: 1})
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
                    <RegularText>You haven't favourited any activities yet</RegularText>
                )}
            </View>
        );
    }
}

export default ActivitiesFavouritesScreen;
