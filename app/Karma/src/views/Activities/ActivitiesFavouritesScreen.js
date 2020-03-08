import React, {Component} from "react";
import {View} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";

var activities = [
    {
        name: "Litter Picking",
        id: 50,
        location: "Waterloo Bridge, London",
        available_spots: 25,
        remaining_spots: 20,
        date: new Date("2020-03-15T11:00:22.000Z"),
        description:
            "#LitterHeroes is our way of supporting everyone who wants to do their bit to create a better environment on their doorstep and anyone who is already making a difference.",
    },
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

class ActivitiesFavouritesScreen extends Component {
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

export default ActivitiesFavouritesScreen;
