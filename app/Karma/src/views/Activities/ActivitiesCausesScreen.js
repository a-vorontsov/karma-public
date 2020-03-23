import React, {Component} from "react";
import {View} from "react-native";
import ActivityCauseCarousel from "../../components/activities/ActivityCauseCarousel";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import {getAuthToken} from "../../util/credentials";

const request = require("superagent");

class ActivitiesCausesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activitiesByCause: [],
            activeSlide: 0,
        };
        this.fetchAllActivities();
    }

    async fetchAllActivities() {
        const authToken = await getAuthToken();
        request
            .get("http://localhost:8000/event/causes")
            .set("authorization", authToken)
            .then(result => {
                let activitiesByCause = result.body.data;
                console.log(activitiesByCause);
                this.setState({
                    activitiesByCause,
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
            <View style={Styles.ph24}>
                {Object.keys(this.state.activitiesByCause).length > 0 ? (
                    Object.entries(this.state.activitiesByCause).map(
                        ([cause, activities]) => {
                            return (
                                <ActivityCauseCarousel
                                    key={activities.eventId}
                                    cause={cause}
                                    activities={activities}
                                />
                            );
                        },
                    )
                ) : (
                    <RegularText>
                        Could not find any activities (Refresh)
                    </RegularText>
                )}
            </View>
        );
    }
}

export default ActivitiesCausesScreen;
