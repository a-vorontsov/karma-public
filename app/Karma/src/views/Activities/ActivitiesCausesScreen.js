import React, {Component} from "react";
import {View} from "react-native";
import ActivityCauseCarousel from "../../components/activities/ActivityCauseCarousel";
import Styles from "../../styles/Styles";

const activities = [
    {
        name: "Charity Run",
        id: 10,
        location: "Greenwich, London",
        available_spots: 15,
        remaining_spots: 12,
        date: new Date("2020-06-07T18:20:00.000Z"),
        description:
            "Running for charity is a great way to be part of something truly worthwhile. Take on a fun run, 5K, 10K or even a marathon - it gives you focus, inspiration and motivation to get over the finish line as well as the chance to raise funds for your chosen charity. Find an event, join the team and become a charity runner today!",
    },
];

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
                <ActivityCauseCarousel activities={activities} />
            </View>
        );
    }
}

export default ActivitiesCausesScreen;
