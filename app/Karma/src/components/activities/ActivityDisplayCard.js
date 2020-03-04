import React from "react";

import {GradientButton, InfoBar} from "../buttons";
import {View, Image, Text, Dimensions, TouchableOpacity} from "react-native";
import {RegularText, SemiBoldText} from "../text";
import Styles from "../../styles/Styles";
import ReadMore from "react-native-read-more-text";
import ActivityCard from "./ActivityCard";
import CarouselStyles from "../../styles/CarouselStyles";
import Carousel from "react-native-snap-carousel";
import Colours from "../../styles/Colours";

const carouselEntries = [{individual: true}];
const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

const icons = {
    share: require("../../assets/images/general-logos/export-logo.png"),
    profile: require("../../assets/images/general-logos/globe.png"),
};

const ActivityDisplayCard = props => {
    return (
        <View>
            <View style={{backgroundColor: "red", height:60, flexDirection:"row", alignItems:"center"}}>
                <TouchableOpacity>
                    <Image
                        source={icons.profile}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 75,
                        }}
                        resizeMode="cover">
                    </Image>
                </TouchableOpacity>
                <View style={{alignItems:"center"}}>
                    <View style={{flexDirection:"row", alignItems:"center", justifyItems:"flex-start"}}>
                        <RegularText>
                            Name
                        </RegularText>
                        <Image>

                        </Image>
                    </View>
                    <RegularText>
                        Location

                    </RegularText>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.share}
                        style={{
                            width: 30,
                            height: 30,
                        }}
                        resizeMode="contain">
                    </Image>
                </TouchableOpacity>
            </View>
            <View style={CarouselStyles.itemContainer3}>
            <View style={[CarouselStyles.item3]}>
                <ActivityCard/>
            </View>
            </View>
        </View>
    );
};

setFav = handlePress => {
    return (favorited = false);
};

_renderTruncatedFooter = handlePress => {
    return (
        <Text style={{color: "#00A8A6", marginTop: 5}} onPress={handlePress}>
            READ MORE
        </Text>
    );
};

export default ActivityDisplayCard;
