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
import ActivityCard from "../../components/activities/ActivityCard";
import Colours from "../../styles/Colours";

const carouselEntries = [{individual: true}, {individual: false}];
const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

class ActivitiesGoingScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    _renderItem = ({item}) => {
        return (
            <View style={CarouselStyles.itemContainer2}>
                <View style={[CarouselStyles.item2, CarouselStyles.shadow]}>
                    <ActivityCard
                        individual={item.individual}
                        signedup={false}
                    />
                </View>
            </View>
        );
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Text>GOING</Text>
            </View>
        );
    }
}

export default ActivitiesGoingScreen;