import React, {Component} from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import Colours from "../../styles/Colours";
import Attendees from "./Attendees";
import SignUpRequests from "./SignUpRequests";
import {RegularText} from "../../components/text";

class ViewSignUpsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: Attendees,
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    setScreen(selectedScreen) {
        this.setState({
            display: selectedScreen,
        });
    }

    render() {
        const activity = this.props.navigation.getParam("activity");
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Activity Sign Ups" />
                </View>
                <View
                    style={{
                        paddingBottom: 30,
                        paddingHorizontal: 24,
                        paddingTop: 20,
                    }}>
                    <View
                        style={{
                            flex: 1,
                            height: 50,
                            paddingBottom: 10,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                        }}>
                        <TouchableOpacity
                            onPress={() => this.setScreen(Attendees)}
                            style={
                                this.state.display === Attendees
                                    ? styles.navButtonActive
                                    : styles.navButtonInactive
                            }>
                            <RegularText
                                style={
                                    this.state.display === Attendees
                                        ? styles.navTextActive
                                        : styles.navTextInactive
                                }>
                                Attendees
                            </RegularText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.setScreen(SignUpRequests)}
                            style={
                                this.state.display === SignUpRequests
                                    ? styles.navButtonActive
                                    : styles.navButtonInactive
                            }>
                            <RegularText
                                style={
                                    this.state.display === SignUpRequests
                                        ? styles.navTextActive
                                        : styles.navTextInactive
                                }>
                                Requests
                            </RegularText>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, marginTop: 10, marginBottom: 100}}>
                        <this.state.display activity={activity} navigation={this.props.navigation} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    navButtonActive: {
        height: 30,
        width: "auto",
        paddingHorizontal: 10,
        marginHorizontal: 10,
        backgroundColor: Colours.blue,
        borderWidth: 0,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    navButtonInactive: {
        height: 30,
        width: "auto",
        paddingHorizontal: 10,
        marginHorizontal: 10,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    navTextInactive: {
        fontSize: 15,
        fontWeight: "700",
        color: Colours.lightGrey,
    },
    navTextActive: {
        fontSize: 15,
        fontWeight: "700",
        color: Colours.white,
    },
});

export default ViewSignUpsScreen;
