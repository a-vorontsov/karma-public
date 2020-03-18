import React, {Component} from "react";
import {View} from "react-native";
import Styles from "../../styles/Styles";
import ActivityEditable from "../../components/activities/ActivityEditable";
import {RegularText} from "../../components/text";
import PageHeader from "../../components/PageHeader";
import {SafeAreaView} from "react-navigation";
import {ScrollView} from "react-native-gesture-handler";

// const getCreatedActivities = async () => {
//     try {
//         if (wpm != null) {
//             return activities;
//         }
//         return 252;
//     } catch (error) {}
// };

class CreatedActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: this.props.navigation.getParam("activities"),
            pastActivities: this.props.navigation.getParam("pastActivities"),
        };
    }
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View>
                <SafeAreaView style={[Styles.ph24, Styles.pv8]}>
                    <PageHeader title="Your Activities" />
                </SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, marginTop: 10, marginBottom: 100}}>
                    {(this.state.activities).length > 0 ? (
                    this.state.activities.map(activity => {
                        return (
                            <ActivityEditable
                                activity={activity}
                                key={activity.id}
                            />
                        );
                    })
                ) : (
                    <View style={Styles.ph24}>
                        <RegularText>
                            Could not find any activities (Refresh)
                        </RegularText>
                    </View>
                )}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default CreatedActivitiesScreen;
