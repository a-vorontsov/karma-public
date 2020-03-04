import React from "react";

import {GradientButton, InfoBar} from "../buttons";
import {View, Image, Text, Dimensions} from "react-native";
import {RegularText, SemiBoldText} from "../text";
import Styles from "../../styles/Styles";
import {TouchableOpacity} from "react-native-gesture-handler";
import ReadMore from "react-native-read-more-text";
import ActivityCard from "./ActivityCard";
import CarouselStyles, {
    itemWidth2,
    sliderWidth,
} from "../../styles/CarouselStyles";
import Carousel from "react-native-snap-carousel";
import Colours from "../../styles/Colours";

const carouselEntries = [{individual: true}];
const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

const icons = {
    fave_inactive: require("../../assets/images/general-logos/fav-outline-profile.png"),
    fave_active: require("../../assets/images/general-logos/heart-red.png"),
    clock: require("../../assets/images/general-logos/clock-logo.png"),
    people: require("../../assets/images/general-logos/people-logo.png"),
    signup: require("../../assets/images/general-logos/favourite.png"),
    date: require("../../assets/images/general-logos/rectangle-blue.png"),
};

const ActivityDisplayCard = props => {
    _renderItem = ({item}) => {
        return (
            <View style={CarouselStyles.itemContainer3}>
                <ActivityCard
                    individual={item.individual}
                    signedup={false}
                />
            </View>
        );
    };

    return (
        <View
            style={{
                flex:1,
                alignItems: "flex-start",
                justifyContent: "flex-start",
                marginLeft: -25
            }}>
                {/* <View style={[Styles.container, Styles.ph24]}>

                </View> */}
                <Carousel
                    ref={c => {
                        this._carousel = c;
                    }}
                    data={carouselEntries}
                    renderItem={this._renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth2}
                />
        </View>
    );
};

export default ActivityDisplayCard;
