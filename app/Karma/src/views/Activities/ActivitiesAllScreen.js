import React, {Component} from "react";
import {View, Image, Text, Dimensions, TouchableOpacity} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";

class ActivitiesAllScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View>
                {activities.map(activity => {
                    return (
                        <ActivityDisplayCard
                            activity={activity}
                            key={activity.id}
                        />
                    );
                })}
            </View>
        );
    }
}

export default ActivitiesAllScreen;
