import React from "react";

import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    Button,
} from "react-native";

import Styles from "../styles/Styles";

export default class HomeScreen extends React.Component {
    render() {
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={Styles.scrollView}>
                    {global.HermesInternal == null ? null : (
                        <View style={Styles.engine}>
                            <Text style={Styles.footer}>Engine: Hermes</Text>
                        </View>
                    )}
                    <View style={Styles.body}>
                        <View style={Styles.sectionContainer}>
                            <Text style={Styles.sectionTitle}>Step One</Text>
                            <Text style={Styles.sectionDescription}>
                                Edit <Text style={Styles.highlight}>App.js</Text> to change this
                                screen and then come back to see your edits.
                            </Text>
                            <Button title="Sign up" onPress={() => navigate("InitSignup")}/>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
};
