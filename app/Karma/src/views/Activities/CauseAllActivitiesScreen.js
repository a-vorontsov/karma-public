import React, {Component} from "react";
import {View} from "react-native";
import Styles from "../../styles/Styles";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import PageHeader from "../../components/PageHeader";
import {SafeAreaView} from "react-navigation";

class CauseAllActivitiesScreen extends Component {
    render() {
        return (
            <View>
                <SafeAreaView style={[Styles.ph24, Styles.pv8]}>
                    <PageHeader title="Cause Name" />
                </SafeAreaView>
                <ActivityDisplayCard />
                <ActivityDisplayCard />
                <ActivityDisplayCard />
            </View>
        );
    }
}

export default CauseAllActivitiesScreen;
