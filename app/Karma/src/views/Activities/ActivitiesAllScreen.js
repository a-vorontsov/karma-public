import React, {Component} from "react";
import {View, Dimensions} from "react-native";
import Styles from "../../styles/Styles";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

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
