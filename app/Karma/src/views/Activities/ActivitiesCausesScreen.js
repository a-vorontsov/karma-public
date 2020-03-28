import React, {Component} from "react";
import {
    RefreshControl,
    ScrollView,
    View,
    Alert,
    Dimensions,
} from "react-native";
import ActivityCauseCarousel from "../../components/activities/ActivityCauseCarousel";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import {getAuthToken} from "../../util/credentials";
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
import {REACT_APP_API_URL} from "react-native-dotenv";

const request = require("superagent");

class ActivitiesCausesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            activitiesByCause: [],
            activeSlide: 0,
        };
        this.onRefresh = this.onRefresh.bind(this);
    }
    async componentDidMount() {
        await this.fetchAllActivities();
    }

    async fetchAllActivities() {
        const authToken = await getAuthToken();
        request
            .get(`${REACT_APP_API_URL}/event/causes`)
            .set("authorization", authToken)
            .then(result => {
                this.setState({
                    activitiesByCause: result.body.data,
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
                <View
                    style={{
                        ...Styles.ph24,
                        flex: 1,
                        marginTop: 10,
                        marginBottom: 100,
                        minHeight: SCREEN_HEIGHT,
                    }}>
                    {Object.keys(this.state.activitiesByCause).length > 0 ? (
                        Object.entries(this.state.activitiesByCause).map(
                            ([cause, activities]) => {
                                return (
                                    <ActivityCauseCarousel
                                        key={cause}
                                        cause={cause}
                                        activities={activities}
                                    />
                                );
                            },
                        )
                    ) : (
                        <RegularText>
                            Could not find any activities (Pull to Refresh)
                        </RegularText>
                    )}
                </View>
            </ScrollView>
        );
    }
}

export default ActivitiesCausesScreen;
