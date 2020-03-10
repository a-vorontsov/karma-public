import React, {Component} from "react";
import {View} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";

class ActivitiesGoingScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View>
                <ActivityDisplayCard favorited={false} />
            </View>
        );
    }
}

export default ActivitiesGoingScreen;
