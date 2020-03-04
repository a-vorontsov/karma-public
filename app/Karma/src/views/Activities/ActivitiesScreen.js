import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Switch,
} from "react-native";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";
import Colours from "../../styles/Colours";
import ActivitiesTab from "../../routes/ActivitiesTabNavigator"
import {createSwitchNavigator, createAppContainer} from "react-navigation";
import ActivitiesAllScreen from "./ActivitiesAllScreen";
import ActivitiesCausesScreen from './ActivitiesCausesScreen';
import ActivitiesGoingScreen from './ActivitiesGoingScreen';
import ActivitiesFavouritesScreen from './ActivitiesFavouritesScreen';

const {width, height} = Dimensions.get("window");

const AppContainer = createAppContainer(ActivitiesTab);

class ActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: ActivitiesAllScreen
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    setScreen(selectedScreen) {
        this.setState({
            display: selectedScreen
        });
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor:Colours.white, flex:1}}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    enabled
                    >
                        <View style={{paddingTop: 24, paddingHorizontal: 24}}>
                        <RegularText
                                style={{
                                    fontSize: 24,
                                    fontWeight: "600",
                                    color: Colours.black,
                                    paddingLeft: 16,
                                    paddingBottom: 10,
                                }}>
                                Activities
                        </RegularText>
                        </View>
                        <View style={{paddingBottom:30, paddingHorizontal: 24}}>
                            <View style={{flex:1, height:50, paddingBottom:10, flexDirection:"row", justifyContent: "flex-start"}}>
                                <TouchableOpacity
                                    onPress={() => this.setScreen(ActivitiesAllScreen)}
                                    style={this.state.display === ActivitiesAllScreen ? styles.navButtonActive : styles.navButtonInactive}>
                                    <RegularText style={this.state.display === ActivitiesAllScreen ? styles.navTextActive : styles.navTextInactive}>All</RegularText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setScreen(ActivitiesCausesScreen)}
                                    style={this.state.display === ActivitiesCausesScreen ? styles.navButtonActive : styles.navButtonInactive}>
                                    <RegularText style={this.state.display === ActivitiesCausesScreen ? styles.navTextActive : styles.navTextInactive}>Causes</RegularText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setScreen(ActivitiesGoingScreen)}
                                    style={this.state.display === ActivitiesGoingScreen ? styles.navButtonActive : styles.navButtonInactive}>
                                    <RegularText style={this.state.display === ActivitiesGoingScreen ? styles.navTextActive : styles.navTextInactive}>Going</RegularText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setScreen(ActivitiesFavouritesScreen)}
                                    style={this.state.display === ActivitiesFavouritesScreen ? styles.navButtonActive : styles.navButtonInactive}>
                                    <RegularText style={this.state.display === ActivitiesFavouritesScreen ? styles.navTextActive : styles.navTextInactive}>Favourites</RegularText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex:1, marginTop: 10, marginBottom:100}}>
                        <this.state.display/>
                    </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        paddingHorizontal:10,
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
        paddingHorizontal:10,
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

export default ActivitiesScreen;
