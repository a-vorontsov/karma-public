import React, {Component} from "react";
import {View, Text, StatusBar, Dimensions, FlatList} from "react-native";
import Styles from "../styles/Styles";
import PageHeader from "../components/PageHeader";
import {hasNotch} from "react-native-device-info";
import {RegularText, BoldText} from "../components/text";
import NotificationItem from "../components/NotificationItem";
import Colours from "../styles/Colours";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;

const DATA = [
    {
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
        title: "has sent you a message",
        org: "Ya",
        logo: require("../assets/images/general-logos/linkedin-logo.png"),
        weeks_ago: 1,
        showReply: 1,
    },
    {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
        title: "has confirmed you can attend the event named ",
        org: "Yah",
        logo: require("../assets/images/general-logos/back-arrow.png"),
        weeks_ago: 2,
    },
    {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Third Item",
        org: "Yeet",
        logo: require("../assets/images/general-logos/photo-logo.png"),
        weeks_ago: 1,
    },
];

function compare(a, b) {
    if (a.weeks_ago < b.weeks_ago) {
        return -1;
    }
    if (a.weeks_ago > b.weeks_ago) {
        return 1;
    }
    return 0;
}

function addTimeStamps() {
    let currentWeeksAgo = DATA[0].weeks_ago;
    for (let i = 0; i < DATA.length - 1; i++) {
        if (i == 0) {
            DATA[i].showTimeStamp = 1;
        } else if (DATA[i + 1].weeks_ago != currentWeeksAgo) {
            DATA[i + 1].showTimeStamp = 1;
        }
    }
}

class NotificationsScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        DATA.sort(compare);
        addTimeStamps();
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
                            backgroundColor: Colours.lighterGrey,
                            height: SCREEN_HEIGHT,
                        }}>
                        <View
                            style={{
                                width: FORM_WIDTH,
                                alignSelf: "center",
                                paddingTop: 20,
                            }}>
                            <FlatList
                                data={DATA}
                                style={{height: SCREEN_HEIGHT}}
                                renderItem={({item}) => (
                                    <>
                                        {
                                            <View>
                                                {item.showTimeStamp ? (
                                                    <BoldText>
                                                        {item.weeks_ago +
                                                            " weeks ago"}
                                                    </BoldText>
                                                ) : (
                                                    undefined
                                                )}

                                                <NotificationItem data={item} />
                                            </View>
                                        }
                                    </>
                                )}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default NotificationsScreen;
