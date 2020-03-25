import React, {Component} from "react";
import {
    View,
    FlatList,
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    ScrollView,
    Alert,
} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import {RegularText} from "../../components/text";
import {GradientButton} from "../../components/buttons";
import Styles from "../../styles/Styles";
import {getAuthToken} from "../../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const formWidth = 0.6 * SCREEN_WIDTH;

const request = require("superagent");

class ActivitiesAllScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            loading: true, // Loading state used while loading the data for the first time
            activitiesList: [], // Data Source for the FlatList
            fetchingDataFromServer: false, // Loading state used while loading more data
        };
        this.page = 1;
        this.fetchActivities = this.fetchActivities.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    static navigationOptions = {
        headerShown: false,
    };

    async componentDidMount() {
        this.setState({loading: true});
        this.fetchActivities();
    }

    async fetchActivities() {
        const authToken = await getAuthToken();
        this.setState({fetchingDataFromServer: true});
        request
            .get(`${REACT_APP_API_URL}/event`)
            .set("authorization", authToken)
            .query({currentPage: this.page, pageSize: 5})
            .then(async res => {
                console.log(res.body.message);
                this.page = this.page + 1; //Increasing the offset for the next API call.
                this.setState({
                    loading: false,
                    fetchingDataFromServer: false,
                    activitiesList: [
                        ...this.state.activitiesList,
                        ...res.body.data.events,
                    ], //adding the new data with old one available in Data Source of the List
                });
            })
            .catch(er => {
                console.log(er);
            });
    }

    renderFooter() {
        return (
            //Footer View with Load More button
            <View style={{width: formWidth, marginLeft: formWidth * 0.3}}>
                {this.state.fetchingDataFromServer ? (
                    <ActivityIndicator color="grey" style={{marginLeft: 8}} />
                ) : (
                    <GradientButton
                        onPress={this.fetchActivities}
                        title="Load More"
                    />
                )}
            </View>
        );
    }

    async onRefresh() {
        this.page = 1;
        this.setState({isRefreshing: true}); // true isRefreshing flag for enable pull to refresh indicator
        const authToken = await getAuthToken();
        request
            .get(`${REACT_APP_API_URL}/event`)
            .set("authorization", authToken)
            .query({currentPage: this.page, pageSize: 5})
            .then(async res => {
                console.log(res.body.message);
                this.page = this.page + 1; //Increasing the offset for the next API call.
                this.setState({
                    isRefreshing: false,
                    activitiesList: res.body.data.events,
                });
            })
            .catch(er => {
                console.log(er);
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
        if (this.state.loading && this.page === 1) {
            return (
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                    }}>
                    <ActivityIndicator style={{color: "#000"}} />
                </View>
            );
        }
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
                    {this.state.loading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <FlatList
                            style={{width: "100%"}}
                            keyExtractor={activity => activity.eventId}
                            data={this.state.activitiesList}
                            renderItem={({item}) => (
                                <ActivityDisplayCard activity={item} />
                            )}
                            ListFooterComponent={this.renderFooter.bind(this)} //Adding Load More button as footer component
                            ListEmptyComponent={
                                <View style={Styles.ph24}>
                                    <RegularText>
                                        Could not find any activities (Pull to Refresh)
                                    </RegularText>
                                </View>
                            }
                        />
                    )}
                </View>
            </ScrollView>
        );
    }
}

export default ActivitiesAllScreen;
