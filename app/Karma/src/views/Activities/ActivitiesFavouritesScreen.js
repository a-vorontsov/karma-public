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
} from "react-native";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";
import CarouselStyles from "../../styles/CarouselStyles";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import Colours from "../../styles/Colours";

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;


class ActivitiesFavouritesScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View>
                <ActivityDisplayCard/>
                <ActivityDisplayCard/>
                <ActivityDisplayCard/>
            </View>
        );
    }
}

export default ActivitiesFavouritesScreen;