import React, {Component} from "react";
import {View, FlatList, RefreshControl, ActivityIndicator} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";
import {getAuthToken} from "../../util/credentials";
import {SafeAreaView} from "react-navigation";

const request = require("superagent");

class ActivitiesAllScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // activity list loading
            isRefreshing: false, //for pull to refresh
            activitiesList: [],
            error: "",
            page: 1,
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    componentDidMount() {
        console.log("heeeere");
        this.fetchAllActivities(this.state.page);
    }

    async fetchAllActivities(page) {
        const authToken = await getAuthToken();
        this.setState({
            loading: true,
        });
        await request
            .get("http://localhost:8000/event")
            .set("authorization", authToken)
            .query({currentPage: page, pageSize: 15})
            .then(async res => {
                console.log(res.body.message);
                const listData = this.state.activitiesList;
                let activitiesList = listData.concat(res.body.data.events);
                await this.setState({
                    loading: false,
                    activitiesList: activitiesList,
                });
            })
            .catch(er => {
                console.log(er);
                this.setState({
                    loading: false,
                    error: "Can't load more activities at the moment",
                });
            });
    }

    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.loading) {
            return null;
        }
        return <ActivityIndicator style={{color: "#000"}} />;
    };

    handleLoadMore = info => {
        console.log(info);
        if (!this.state.loading) {
            this.setState({page: this.state.page + 1});
            this.fetchAllActivities(this.state.page); // method for API call
        }
    };

    async onRefresh() {
        const authToken = await getAuthToken();
        this.setState({isRefreshing: true}); // true isRefreshing flag for enable pull to refresh indicator
        request
            .get("http://localhost:8000/event")
            .set("authorization", authToken)
            .query({currentPage: this.state.page, pageSize: 5})
            .then(res => {
                let data = res.body.data.events;
                this.setState({
                    isRefreshing: false,
                    activitiesList: data,
                }); // false isRefreshing flag for disable pull to refresh indicator, and clear all data and store only first page data
            })
            .catch(er => {
                console.log(er);
                this.setState({
                    isRefreshing: false,
                    error: "Can't load more activities at the moment",
                });
            });
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                {this.state.activitiesList.length > 0 ? (
                    <FlatList
                        data={this.state.activitiesList}
                        extraData={this.state}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                        renderItem={({item}) => (
                            <ActivityDisplayCard activity={item} />
                        )}
                        keyExtractor={(activity, index) => index.toString()}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        onEndReachedThreshold={0.8}
                        onEndReached={this.handleLoadMore.bind(this)}
                    />
                ) : (
                    <View style={Styles.ph24}>
                        <RegularText>
                            Could not find any activities (Refresh)
                        </RegularText>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

export default ActivitiesAllScreen;
