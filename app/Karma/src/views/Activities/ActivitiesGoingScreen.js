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
import CarouselStyles, {
    itemWidth2,
    sliderWidth,
} from "../../styles/CarouselStyles";
import Carousel from "react-native-snap-carousel";
import ActivityDisplayCard from "../../components/activities/ActivityDisplayCard";
import Colours from "../../styles/Colours";

const carouselEntries = [{individual: true}, {individual: false}];
const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

class ActivitiesGoingScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View style={CarouselStyles.itemContainer2}>
            <View style={[CarouselStyles.item2, CarouselStyles.shadow]}>
                <ActivityDisplayCard/>
            </View>
        </View>
        );
    }
}

export default ActivitiesGoingScreen;