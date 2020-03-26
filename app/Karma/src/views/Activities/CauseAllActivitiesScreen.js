import React, {Component} from "react";
import {View, FlatList, Dimensions} from "react-native";
import Styles from "../../styles/Styles";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import PageHeader from "../../components/PageHeader";
import {SafeAreaView} from "react-navigation";
import {RegularText} from "../../components/text";
const {width} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * width;

class CauseAllActivitiesScreen extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const activities = this.props.navigation.getParam("activities");
        return (
            <SafeAreaView style={Styles.container}>
                <View style={{width: FORM_WIDTH, alignSelf: "center"}}>
                    <PageHeader
                        title={this.props.navigation.getParam("cause")}
                    />
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{width: "100%"}}
                    keyExtractor={activity => activity.eventId.toString()}
                    data={activities}
                    renderItem={({item}) => (
                        <ActivityDisplayCard
                            activity={item}
                            key={item.eventId}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={Styles.ph24}>
                            <RegularText>
                                Could not find any activities (Pull to Refresh)
                            </RegularText>
                        </View>
                    }
                />
            </SafeAreaView>
        );
    }
}

export default CauseAllActivitiesScreen;
