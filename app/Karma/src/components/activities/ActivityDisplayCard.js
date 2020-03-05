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
import { NavigationEvents } from "react-navigation";

const carouselEntries = [{individual: true}];
const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

const icons = {
    share: require("../../assets/images/general-logos/export-logo.png"),
    profile: require("../../assets/images/general-logos/globe.png"),
};

const ActivityDisplayCard = props => {
    // const {navigate} = this.props.navigation;
    return (
        <View>
            <View style={{backgroundColor: Colours.backgroundWhite, height:60, paddingHorizontal: 24, flexDirection:"row", alignItems:"center"}}>
                    <Image
                        source={icons.profile}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 75,
                            paddingHorizontal: 24
                        }}
                        resizeMode="cover">
                    </Image>
                <View style={{alignItems:"center"}}>
                    <View style={{alignItems:"flex-start", marginLeft:15}}>
                    <View style={{flexDirection:"row", alignItems:"center", justifyItems:"flex-start"}}>
                        <RegularText
                            style={{fontSize:20, color: Colours.black, fontWeight: "500"}}
                        >
                            Name
                        </RegularText>
                        <Image>

                        </Image>
                    </View>
                    <RegularText
                        style={{fontSize:15, color: Colours.lightGrey, fontWeight: "500"}}
                    >
                        Location
                    </RegularText>
                </View>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.share}
                        style={{
                            marginLeft:200,
                            alignSelf: "flex-end",
                            width: 30,
                            height: 30,
                        }}
                        resizeMode="contain">
                    </Image>
                </TouchableOpacity>
            </View>
            <View style={CarouselStyles.itemContainer3}>
            <View style={[CarouselStyles.item3]}>
                <ActivityCard
                    favorited={props.favorited}/>
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
