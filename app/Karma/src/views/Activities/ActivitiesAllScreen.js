import React, {Component} from "react";
import {View} from "react-native";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

var activities = [
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
        name: "Christmas Carols",
        id: 60,
        location: "Eiffel Tower, Paris",
        available_spots: 10,
        remaining_spots: 7,
        date: new Date("2020-05-06T13:15:00.000Z"),
        description:
            "Our traditional Carol Service will be on December 15 at 7pm at Église Saint Esprit at 5, Rue Roquepine, 75008 followed by mulled wine and minced pies back at Saint Michael’s. On the same day, at 10:45 in the morning, we will have an all-age Nativity service at Saint Michael’s, involving the children. Both will be invitational events which we hope your friends and family will enjoy with you.",
    },
];

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
