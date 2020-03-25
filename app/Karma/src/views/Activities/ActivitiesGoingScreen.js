import React, {Component} from "react";
import {Alert, RefreshControl, ScrollView, View} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";
import {getAuthToken} from "../../util/credentials";

const request = require("superagent");

class ActivitiesGoingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            isRefreshing: false,
        };
        this.fetchAllActivities();
        this.onRefresh = this.onRefresh.bind(this);
    }

    static navigationOptions = {
        headerShown: false,
    };

    async fetchAllActivities() {
        const authToken = await getAuthToken();
        request
            .get("http://localhost:8000/event/going")
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
                <View style={{flex: 1, marginTop: 10, marginBottom: 100}}>
                    {this.state.activities.length > 0 ? (
                        this.state.activities.map(activity => {
                            return (
                                <ActivityDisplayCard
                                    activity={activity}
                                    key={activity.id}
                                    signedup={true} //TODO
                                />
                            );
                        })
                    ) : (
                        <View style={Styles.ph24}>
                            <RegularText>
                                You have not selected any activities to attend
                                (Refresh)
                            </RegularText>
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    }
}

export default ActivitiesGoingScreen;
