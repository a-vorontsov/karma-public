import React, {Component} from "react";
import {View} from "react-native";
import {RegularText} from "../../components/text";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import Styles from "../../styles/Styles";
import {getAuthToken} from "../../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";

const request = require("superagent");

class ActivitiesFavouritesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
        };
    }

    async componentDidMount() {
        await this.fetchAllActivities();
    }

    async fetchAllActivities() {
        const authToken = await getAuthToken();
        request
            .get(`${REACT_APP_API_URL}/event/favourites`)
            .set("authorization", authToken)
            .then(result => {
                console.log(result.body.message);
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
                                key={activity.eventId}
                            />
                        );
                    })
                ) : (
                    <View style={Styles.ph24}>
                        <RegularText>
                            {" "}
                            You haven't favourited any activities yet (Refresh)
                        </RegularText>
                    </View>
                )}
            </View>
        );
    }
}

export default ActivitiesFavouritesScreen;
