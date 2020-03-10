import React, {Component} from "react";
import {View} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";

class ActivitiesFavouritesScreen extends Component {
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

export default ActivitiesFavouritesScreen;
