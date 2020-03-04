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

class ActivitiesCausesScreen extends Component {
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
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <TouchableOpacity>
                        <RegularText style={styles.causeHeader}>
                            Cause Name
                        </RegularText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{marginLeft: 150, alignItems: "center",}}>
                        <RegularText style={styles.bioHeaderAlt}>
                            See All
                        </RegularText>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                    }}>
                    <Carousel
                        ref={c => {
                            this._carousel = c;
                        }}
                        data={carouselEntries}
                        removeClippedSubviews={false}
                        renderItem={this._renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth2}
                        inactiveSlideOpacity={1}
                        inactiveSlideScale={1}
                        containerCustomStyle={CarouselStyles.slider}
                        onSnapToItem={index =>
                            this.setState({activeSlide: index})
                        }
                    />
                </View>
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
