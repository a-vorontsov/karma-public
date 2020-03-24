import React, {Component} from "react";
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import {RegularText} from "../../components/text";
import {GradientButton} from "../../components/buttons";
import Styles from "../../styles/Styles";
import {getAuthToken} from "../../util/credentials";
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const formWidth = 0.6 * SCREEN_WIDTH;
const request = require("superagent");

class ActivitiesAllScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true, // Loading state used while loading the data for the first time
            activitiesList: [], // Data Source for the FlatList
            fetchingDataFromServer: false, // Loading state used while loading more data
        };
        this.page = 1;
        this.loadMoreActivities = this.loadMoreActivities.bind(this);
    }

    static navigationOptions = {
        headerShown: false,
    };

    async componentDidMount() {
        const authToken = await getAuthToken();
        request
            .get("http://localhost:8000/event")
            .set("authorization", authToken)
            .query({currentPage: this.page, pageSize: 5})
            .then(async res => {
                console.log(res.body.message);
                this.page = this.page + 1; //Increasing the offset for the next API call.
                this.setState({
                    loading: false,
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

    async loadMoreActivities() {
        this.setState({fetchingDataFromServer: true});
        const authToken = await getAuthToken();
        request
            .get("http://localhost:8000/event")
            .set("authorization", authToken)
            .query({currentPage: this.page, pageSize: 5})
            .then(res => {
                console.log(res.body.message);
                this.page = this.page + 1; //Increasing the offset for the next API call.
                this.setState({
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
                        onPress={this.loadMoreActivities}
                        title="Load More"
                    />
                )}
            </View>
        );
    }

    render() {
        return (
            <View>
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
                                    Could not find any activities (Refresh)
                                </RegularText>
                            </View>
                        }
                    />
                )}
            </View>
        );
    }
}

export default ActivitiesAllScreen;
