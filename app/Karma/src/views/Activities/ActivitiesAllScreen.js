import React, {Component} from "react";
import {View, Image, Text, Dimensions, TouchableOpacity} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import {RegularText} from "../../components/text";

const request = require("superagent");

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

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
                    <RegularText>Could not find any activities</RegularText> // REFRESH BUTTON
                )}
            </View>
        );
    }
}

export default ActivitiesAllScreen;
