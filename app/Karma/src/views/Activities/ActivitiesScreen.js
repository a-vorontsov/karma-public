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
import Slider from "@react-native-community/slider";
import {RegularText} from "../../components/text";
import {GradientButton} from "../../components/buttons";
import Styles from "../../styles/Styles";
import Colours from "../../styles/Colours";
import ActivityCard from "../../components/activities/ActivityCard";
import ActivitiesTab from "../../routes/ActivitiesTabNavigator"
import {createSwitchNavigator, createAppContainer} from "react-navigation";

const {width, height} = Dimensions.get("window");

const AppContainer = createAppContainer(ActivitiesTab);

class ActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static navigationOptions = {
        headerShown: false,
    };
    render() {
        return (
            <SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView
                    style={Styles.ph24}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    enabled>
                    <View style={{paddingTop: 24}} />
                    <RegularText
                        style={{
                            fontSize: 24,
                            fontWeight: "600",
                            color: Colours.black,
                            paddingLeft: 16,
                        }}>
                        Activities
                    </RegularText>
                    <View>
                        <AppContainer/>
                    </View>
                    
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <AppContainer/>
                    </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

export default ActivitiesScreen;
