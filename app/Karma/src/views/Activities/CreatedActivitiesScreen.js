import React, {Component} from "react";
import {View, Dimensions} from "react-native";
import Styles from "../../styles/Styles";
import ActivityEditable from "../../components/activities/ActivityEditable";
import PageHeader from "../../components/PageHeader";
import {RegularText} from "../../components/text";
import {SafeAreaView} from "react-navigation";
import { ScrollView } from "react-native-gesture-handler";

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

const getCreatedActivities = async () => {
    try {
      if (wpm != null) {
        return activities;
      }
      return 252;
    } catch (error) {}
  };

class CreatedActivitiesScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View>
                <SafeAreaView style={[Styles.ph24, Styles.pv8]}>
                    <PageHeader title="Your Activities" />
                </SafeAreaView>
                <ScrollView>
                    <ActivityEditable />
                    <ActivityEditable />
                </ScrollView>
            </View>
        );
    }
}

export default CreatedActivitiesScreen;
