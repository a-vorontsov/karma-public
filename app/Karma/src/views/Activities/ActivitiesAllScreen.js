import React, {Component} from "react";
import {View} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";

class ActivitiesAllScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View>
                <ActivityDisplayCard />
                <ActivityDisplayCard />
                <ActivityDisplayCard />
            </View>
        );
    }
}

export default ActivitiesAllScreen;
