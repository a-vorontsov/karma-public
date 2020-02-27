import React from "react";

import {View, Image} from "react-native";

import {GradientButton, InfoBar} from "./buttons";
import {RegularText, SemiBoldText} from "./text";
import Styles from "../styles/Styles";

import {useNavigation} from "react-navigation-hooks";
import {TouchableOpacity} from "react-native-gesture-handler";

const icons = {
    fave_inactive: require("../assets/images/general-logos/fav-outline-profile.png"),
    fave_active: require("../assets/images/general-logos/fav-outline-profile.png"),
    clock: require("../assets/images/general-logos/clock-logo.png"),
    people: require("../assets/images/general-logos/people-logo.png"),
    signup: require("../assets/images/general-logos/favourite.png"),
};

const ActivityCard = props => {
    const navigation = useNavigation();
    return (
        <View style={[Styles.container, Styles.ph24]}>
            <View style={[Styles.pb24, Styles.bottom]}>
                <Image source={props.signedup ? icons.signup : null} 
                    style={{
                        position:"absolute",
                        top: 0,
                        right: 0,
                        height: 50,
                        width: 50,
                        resizeMode: "contain",
                    }}
                />
                <Image
                    source={
                        props.individual
                            ? require("../assets/images/general-logos/hands-heart.png")
                            : require("../assets/images/general-logos/globe.png")
                    }
                    style={{flex: 1, width: null, height: null, marginBottom: 10}}
                    resizeMode="cover"
                />
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                        }}>
                        <InfoBar title="TIME" image={icons.clock} />
                        <InfoBar title="0 SPOTS LEFT" image={icons.people} />
                        <TouchableOpacity>
                            <Image
                                source={props.favorited ? icons.fave_inactive : icons.fave_active}
                                style={{
                                    width: 30,
                                    height: 30,
                                    resizeMode: "contain",
                                    marginLeft: 20,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    <RegularText style={{fontWeight: "500", fontSize: 20, marginVertical:8}}>
                        Activity Name
                    </RegularText>
                </View>
                <View>
                    <RegularText>
                        Activity description, consectetur adip isicing elit, sed
                        do eiusm ut labore et dolore magna aliqua
                    </RegularText>
                </View>
            </View>
        </View>
    );
};

export default ActivityCard;
