import React from "react";

import {View, Image, Text, Dimensions, TouchableOpacity} from "react-native";
import {RegularText, SemiBoldText} from "../text";
import ActivityCard from "./ActivityCard";
import CarouselStyles from "../../styles/CarouselStyles";
import Colours from "../../styles/Colours";
import {NavigationEvents} from "react-navigation";
import {useNavigation} from "react-navigation-hooks";

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
            <View
                style={{
                    backgroundColor: Colours.backgroundWhite,
                    height: 60,
                    paddingHorizontal: 24,
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                <Image
                    source={icons.profile}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 75,
                        paddingHorizontal: 24,
                    }}
                    resizeMode="cover"
                />
                <View style={{alignItems: "center"}}>
                    <View style={{alignItems: "flex-start", marginLeft: 15}}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyItems: "flex-start",
                            }}>
                            <RegularText
                                style={{
                                    fontSize: 20,
                                    color: Colours.black,
                                    fontWeight: "500",
                                }}>
                                {props.activity.name}
                            </RegularText>
                            <Image />
                        </View>
                        <RegularText
                            style={{
                                fontSize: 15,
                                color: Colours.lightGrey,
                                fontWeight: "500",
                            }}>
                            {props.activity.location}
                        </RegularText>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItem: "flex-end",
                        justifyContent: "flex-end",
                    }}>
                    <TouchableOpacity style={{alignSelf: "flex-end"}}>
                        <Image
                            source={icons.share}
                            style={{
                                alignSelf: "flex-end",
                                width: 30,
                                height: 30,
                            }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={CarouselStyles.itemContainer3}>
                <View style={[CarouselStyles.item3]}>
                    <ActivityCard activity={props.activity} favorited={props.favorited} />
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
