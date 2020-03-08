import React from "react";

import {View, Image, Text, Dimensions, TouchableOpacity, StyleSheet} from "react-native";
import {RegularText, SemiBoldText} from "../text";
import ActivityCard from "./ActivityCard";
import CarouselStyles from "../../styles/CarouselStyles";
import Colours from "../../styles/Colours";
import {NavigationEvents} from "react-navigation";
import {useNavigation} from "react-navigation-hooks";
import Styles from "../../styles/Styles";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';

const carouselEntries = [{individual: true}];
const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

const icons = {
    share: require("../../assets/images/general-logos/export-logo.png"),
    date: require("../../assets/images/general-logos/rectangle-blue.png"),
    dots: require("../../assets/images/general-logos/triple-dot-blue.png"),
};

const ActivityEditable = props => {
    const navigation = useNavigation();
    return (
        <View>
            <View
                style={{
                    backgroundColor: Colours.backgroundWhite,
                    height: 30,
                    alignItems:"flex-end"
                }}>
                <View
                    style={{
                    }}>
                    {/* <TouchableOpacity onPress={() => navigation.navigate("ActivityEdit")}> */}
                    <TouchableOpacity>
                        <Menu>
                            <MenuTrigger>
                                <Image source={icons.dots} style={{width:40, height:40, marginRight:20, marginBottom: 10}} resizeMode="contain"/>
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => alert(`Share`)}>
                                    <RegularText style={styles.settingsText}>Share Activity</RegularText>
                                </MenuOption>
                                <MenuOption onSelect={() => navigation.navigate("ActivityEdit")}>
                                    <RegularText style={styles.settingsText}>Edit Activity</RegularText>
                                </MenuOption>
                                <MenuOption onSelect={() => navigation.navigate("ViewSignUps")}>
                                    <RegularText style={styles.settingsText}>View Sign Ups</RegularText>
                                </MenuOption>
                                <MenuOption onSelect={() => alert(`Are you sure you want to delete?`)}>
                                    <RegularText style={styles.settingsText}>Delete Activity</RegularText>
                                </MenuOption>
                            </MenuOptions>
                       </Menu>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={CarouselStyles.itemContainer3}>
                <View style={[CarouselStyles.item3]}>
                <View style={[Styles.container, Styles.ph24]}>
            <View style={[Styles.pb24, Styles.bottom]}>
                <Image
                    source={require("../../assets/images/general-logos/globe.png")}
                    style={{
                        flex: 1,
                        width: null,
                        height: null,
                        marginBottom: 10,
                    }}
                    resizeMode="cover"
                />
                <Image
                    source={icons.date}
                    style={[styles.icon, {left:5}]}
                />
                <RegularText
                    style={[styles.dateText, {top: 5, left: 1,}]}>
                    {" "}
                    MON
                </RegularText>
                <RegularText
                    style={styles.dateText}>
                    {" "}
                    DAY
                </RegularText>
                <View>
                    <RegularText
                        style={{
                            fontWeight: "500",
                            fontSize: 20,
                            marginVertical: 8,
                        }}>
                        Activity Name
                    </RegularText>
                </View>
            </View>
        </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dateText: {
        position: "absolute",
        top: 25,
        left: 0,
        height: 50,
        width: 50,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "500",
        color: "white",
    },
    settingsText: {
        fontSize: 15

    },
    icon: {
        position: "absolute",
        top: 5,
        right: 5,
        height: 50,
        width: 50,
        resizeMode: "contain",
    }
});

export default ActivityEditable;
