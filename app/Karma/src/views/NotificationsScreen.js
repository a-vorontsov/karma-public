import React, {Component} from "react";
import {
    RefreshControl,
    View,
    StatusBar,
    Dimensions,
    Alert,
    TouchableOpacity,
} from "react-native";
import Styles from "../styles/Styles";
import PageHeader from "../components/PageHeader";
import {hasNotch} from "react-native-device-info";
import {SemiBoldText, RegularText} from "../components/text";
import NotificationItem from "../components/NotificationItem";
import Colours from "../styles/Colours";
import {ScrollView} from "react-native-gesture-handler";
import {getAuthToken} from "../util/credentials";
const request = require("superagent");

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const FORM_WIDTH = 0.85 * SCREEN_WIDTH;

/**
 * Sorts array by most recent notification first
 */
function compare(a, b) {
    if (a.timestampSent < b.timestampSent) {
        return 1;
    } else if (a.timestampSent > b.timestampSent) {
        return -1;
    }
    return 0;
}

class NotificationsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            hasNotifications: false,
            weekNotifications: [],
            monthNotifications: [],
            refreshing: false,
            userId: 0,
        };
    }

    getNotifications = async () => {
        this.setState({refreshing: true});
        const authToken = await getAuthToken();
        try {
            const response = await request
                .get("http://localhost:8000/notification")
                .set("authorization", authToken);
            console.log(response.body.data);
            this.setState({
                notifications: response.body.data.notifications,
            });

            this.parseNotifications();
        } catch (error) {
            Alert.alert("Unable to fetch new notifications", error);
            this.setState({refreshing: true});
        }
    };

    async componentDidMount() {
        const {navigation} = this.props;
        this.willFocusListener = navigation.addListener("willFocus", () => {
            this.getNotifications();
        });
    }
    componentWillUnmount() {
        this.willFocusListener.remove();
    }

    getDaysBetween = (d1, d2) => {
        var diff = Math.abs(d1.getTime() - d2.getTime());
        return diff / (1000 * 60 * 60 * 24);
    };

    /**
     * Only displays notifications that the user/org has
     * received rather than sent
     */
    parseNotifications = cleared => {
        const {notifications} = this.state;

        let received = [];

        //get all received notifications
        notifications.forEach(n => {
            const timestamp = new Date(n.timestampSent);
            if (cleared || timestamp < this.state.minTimestamp) {
                this.setState({minTimestamp: new Date()});
            } else {
                received.push(n);
            }
        });

        received.sort(compare);

        let weekNotifications = [];

        let monthNotifications = [];

        //get notifications for the month and week
        received.forEach(r => {
            let timestamp = new Date(r.timestampSent);
            let curDate = new Date();

            let daysAgo = Math.floor(this.getDaysBetween(curDate, timestamp));

            if (daysAgo <= 7) {
                r.daysAgo = daysAgo;
                weekNotifications.push(r);
            }

            if (daysAgo <= 31) {
                r.daysAgo = daysAgo;
                monthNotifications.push(r);
            }
        });

        let hasNotifications = monthNotifications.length > 0;

        this.setState({
            hasNotifications: hasNotifications,
            weekNotifications: weekNotifications,
            monthNotifications: monthNotifications,
            refreshing: false,
        });
    };

    _renderMonthNotifications = () => {
        const {monthNotifications} = this.state;

        return monthNotifications.map(n => {
            return <NotificationItem notification={n} key={n.id} />;
        });
    };

    _renderWeekNotifications = () => {
        const {weekNotifications} = this.state;

        if (weekNotifications.length === 0) {
            return (
                <SemiBoldText style={[Styles.pb16, {alignSelf: "center"}]}>
                    No new notifications this week
                </SemiBoldText>
            );
        }

        return weekNotifications.map(n => {
            return <NotificationItem key={n.id} notification={n} />;
        });
    };

    render() {
        const {hasNotifications, refreshing} = this.state;

        return (
            <View style={Styles.container}>
                <View style={{alignItems: "center"}}>
                    <View
                        style={{
                            marginTop: hasNotch()
                                ? 40
                                : StatusBar.currentHeight,
                            width: FORM_WIDTH,
                        }}>
                        <PageHeader title="Notifications" disableBack={true} />
                    </View>
                    <View
                        style={{
                            width: SCREEN_WIDTH,
                            backgroundColor: Colours.lightestGrey,
                            height: 700,
                        }}>
                        <View
                            style={{
                                width: FORM_WIDTH,
                                alignSelf: "center",
                                paddingTop: 20,
                                flex: 1,
                            }}>
                            {hasNotifications ? (
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={() =>
                                                this.getNotifications()
                                            }
                                        />
                                    }>
                                    <View style={{flexDirection: "row"}}>
                                        <View style={{flex: 1}}>
                                            <SemiBoldText style={[Styles.pb16]}>
                                                This Week
                                            </SemiBoldText>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignItems: "flex-end",
                                            }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.parseNotifications(
                                                        true,
                                                    );
                                                }}>
                                                <RegularText>Clear</RegularText>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {this._renderWeekNotifications()}
                                    <SemiBoldText style={[Styles.pb16]}>
                                        This Month
                                    </SemiBoldText>
                                    {this._renderMonthNotifications()}
                                </ScrollView>
                            ) : (
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={() =>
                                                this.getNotifications()
                                            }
                                        />
                                    }>
                                    <View
                                        style={{flex: 1, alignSelf: "center"}}>
                                        <RegularText
                                            style={{
                                                fontSize: 20,
                                            }}>
                                            No notifications found
                                        </RegularText>
                                    </View>
                                </ScrollView>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default NotificationsScreen;
