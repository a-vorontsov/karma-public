import React, {Component} from "react";
import {View} from "react-native";
import ActivityCauseCarousel from "../../components/activities/ActivityCauseCarousel";
import Styles from "../../styles/Styles";

class ActivitiesCausesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View style={Styles.ph24}>
                <ActivityCauseCarousel />
                <ActivityCauseCarousel />
                <ActivityCauseCarousel />
                <ActivityCauseCarousel />
            </View>
        );
    }
}

export default ActivitiesCausesScreen;
