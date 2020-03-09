import React, {Component} from "react";
import {View} from "react-native";
import ActivityCauseCarousel from "../../components/activities/ActivityCauseCarousel";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";

const request = require("superagent");

class ActivitiesCausesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            activeSlide: 0,
        };
        this.fetchAllActivities();
    }

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

    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View>
                {
                    this.state.activities.length > 0 ? (
                    <View style={Styles.ph24}>
                        <ActivityCauseCarousel
                            activities={this.state.activities}
                        />
                    </View>
                ) : (
                    <RegularText>Could not find any activities</RegularText>
                ) // REFRESH BUTTON
                }
            </View>
        );
    }
}

export default ActivitiesCausesScreen;
