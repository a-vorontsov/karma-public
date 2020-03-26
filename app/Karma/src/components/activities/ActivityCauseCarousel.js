import React from "react";
import {StyleSheet, TouchableOpacity, View, Dimensions} from "react-native";
import {RegularText} from "../../components/text";
import CarouselStyles, {
    itemWidth2,
    sliderWidth,
} from "../../styles/CarouselStyles";
import Carousel from "react-native-snap-carousel";
import ActivityCard from "./ActivityCard";
import Colours from "../../styles/Colours";
import {useNavigation} from "react-navigation-hooks";
const {width: SCREEN_WIDTH} = Dimensions.get("screen");
const FORM_WIDTH = 0.9 * SCREEN_WIDTH;
class ActivityCauseCarousel extends React.Component {
    navigation = this.props.navigation;
    _renderItem = ({item}) => {
        return (
            <View style={CarouselStyles.itemContainer2}>
                <View style={[CarouselStyles.item2, CarouselStyles.shadow]}>
                    <ActivityCard
                        activity={item}
                        key={item.id}
                        signedup={false} //TODO should take from props;
                    />
                </View>
            </View>
        );
    };

    titleCase = str => {
        return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
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
                        width: FORM_WIDTH,
                    }}>
                    <TouchableOpacity>
                        <RegularText style={styles.causeHeader}>
                            {this.titleCase(this.props.cause)}
                        </RegularText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            alignItems: "center",
                            position: "absolute",
                            right: 0,
                        }}
                        onPress={() =>
                            this.navigation.navigate("CauseAll", {
                                cause: this.titleCase(this.props.cause),
                                activities: this.props.activities,
                            })
                        }>
                        <RegularText style={styles.bioHeaderAlt}>
                            See All
                        </RegularText>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        marginLeft: -25,
                    }}>
                    <Carousel
                        ref={c => {
                            this._carousel = c;
                        }}
                        data={this.props.activities}
                        removeClippedSubviews={false}
                        renderItem={this._renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth2}
                        inactiveSlideOpacity={1}
                        inactiveSlideScale={1}
                        containerCustomStyle={CarouselStyles.slider}
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

export default props => {
    const navigation = useNavigation();
    return <ActivityCauseCarousel {...props} navigation={navigation} />;
};
