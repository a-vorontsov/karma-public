import React, {Component} from "react";
import {View, Text, StatusBar, Dimensions, FlatList} from "react-native";
import Styles from "../styles/Styles";
import PageHeader from "../components/PageHeader";
import {hasNotch} from "react-native-device-info";
import {RegularText} from "../components/text";
import NotificationItem from "../components/NotificationItem";
import Colours from "../styles/Colours";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;

const DATA = [
    {
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
        title: "First Item",
    },
    {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
        title: "Second Item",
    },
    {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Third Item",
    },
];

class NotificationsScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
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
                                    <NotificationItem data={item} />
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
