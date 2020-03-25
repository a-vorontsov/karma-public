import React, {Component} from "react";
import {Alert, RefreshControl, ScrollView, View} from "react-native";
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
            isRefreshing: false,
            activities: [],
        };
        this.onRefresh = this.onRefresh.bind(this);
    }

    static navigationOptions = {
        headerShown: false,
    };

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
                this.setState({
                    activities: result.body.data.events,
                });
            })
            .catch(er => {
                console.log(er);
            });
    }

    onRefresh() {
        this.setState({isRefreshing: true}); // true isRefreshing flag for enable pull to refresh indicator
        this.fetchAllActivities()
            .then(() => {
                this.setState({
                    isRefreshing: false,
                });
            })
            .catch(err => {
                console.log(err);
                Alert.alert(
                    "An error occurred",
                    "Cannot refresh at the moment.",
                );
                this.setState({
                    isRefreshing: false,
                });
            });
    }

    render() {
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.onRefresh}
                    />
                }>
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
                                You haven't favourited any activities yet (Pull
                                to Refresh)
                            </RegularText>
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    }
}

export default ActivitiesFavouritesScreen;
