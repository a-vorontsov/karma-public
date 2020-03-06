import React, {Component} from "react";
import {
    View,
    Dimensions,
} from "react-native";
import Styles from "../../styles/Styles";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import PageHeader from "../../components/PageHeader";
import { RegularText } from "../../components/text";
import { SafeAreaView } from "react-navigation";

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

class CauseAllActivitiesScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View>
                <SafeAreaView style={[Styles.ph24, Styles.pv8]}>
                <PageHeader title="Cause Name"/>
                </SafeAreaView>
                <ActivityDisplayCard/>
                <ActivityDisplayCard/>
                <ActivityDisplayCard/>
            </View>
        );
    }
}

export default CauseAllActivitiesScreen ;