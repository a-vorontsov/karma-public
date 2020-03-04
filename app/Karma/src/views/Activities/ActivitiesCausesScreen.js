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
import ActivityCauseCarousel from "../../components/activities/ActivityCauseCarousel";
import Colours from "../../styles/Colours";

const carouselEntries = [{individual: true}, {individual: false}];
const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

class ActivitiesCausesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
        };
    }
    
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View>
                <ActivityCauseCarousel/>
                <ActivityCauseCarousel/>
                <ActivityCauseCarousel/>
                <ActivityCauseCarousel/>
                <ActivityCauseCarousel/>
                <ActivityCauseCarousel/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    nameText: {
        fontSize: 30,
        color: Colours.white,
        fontWeight: "bold",
    },
    usernameText: {
        fontSize: 20,
        color: Colours.white,
    },
    locationText: {
        fontSize: 20,
        color: "#75C4C3",
        paddingLeft: 10,
    },
    causeHeader: {
        paddingTop: 25,
        fontSize: 25,
        color: Colours.grey,
        fontWeight: "500",
    },
    bioHeaderAlt: {
        paddingTop: 25,
        fontSize: 18,
        color: Colours.blue,
        fontWeight: "500",
    },
    contentText: {
        fontSize: 15,
        color: Colours.black,
        paddingVertical: 5,
    },
    answerText: {
        fontSize: 15,
        color: Colours.blue,
        paddingVertical: 5,
        paddingLeft: 5,
    },
    editContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    edit: {
        height: 25,
        width: 25,
        alignSelf: "center",
        resizeMode: "contain",
    },
    pointContainer: {
        flex: 1,
    },
});

export default ActivitiesCausesScreen ;
