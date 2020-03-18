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
            activitiesByCause: [],
            activeSlide: 0,
        };
        this.fetchAllActivities();
    }

    fetchAllActivities() {
        request
            .get("http://192.168.0.25:8000//event/causes")
            .query({userId: 76})
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
