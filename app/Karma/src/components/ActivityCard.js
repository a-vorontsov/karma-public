import React from "react";

<<<<<<< HEAD
import {View, Image, Text} from "react-native";

import {GradientButton, InfoBar} from "./buttons";
=======
import {View, Image} from "react-native";

import {GradientButton} from "./buttons";
>>>>>>> Add carousel to view past events and future events
import {RegularText, SemiBoldText} from "./text";
import Styles from "../styles/Styles";

import {useNavigation} from "react-navigation-hooks";
<<<<<<< HEAD
import {TouchableOpacity} from "react-native-gesture-handler";
import ReadMore from 'react-native-read-more-text';

const icons = {
    fave_inactive: require("../assets/images/general-logos/fav-outline-profile.png"),
    fave_active: require("../assets/images/general-logos/fav-outline-profile.png"),
    clock: require("../assets/images/general-logos/clock-logo.png"),
    people: require("../assets/images/general-logos/people-logo.png"),
    signup: require("../assets/images/general-logos/favourite.png"),
};
=======
>>>>>>> Add carousel to view past events and future events

const ActivityCard = props => {
    const navigation = useNavigation();
    return (
        <View style={[Styles.container, Styles.ph24]}>
            <View style={[Styles.pb24, Styles.bottom]}>
<<<<<<< HEAD
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
=======
>>>>>>> Add carousel to view past events and future events
                <Image
                    source={
                        props.individual
                            ? require("../assets/images/general-logos/hands-heart.png")
                            : require("../assets/images/general-logos/globe.png")
                    }
<<<<<<< HEAD
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
                    <ReadMore
                        numberOfLines={2}
                        renderTruncatedFooter={this._renderTruncatedFooter}>
                        <RegularText>
                            Activity description, consectetur adip isicing elit, sed
                            do eiusm ut labore et dolore magna aliqua
                        </RegularText>
                    </ReadMore>
                </View>
=======
                    style={{flex: 1, width: null, height: null}}
                    resizeMode="contain"
                />
                <View style={Styles.pv16}>
                    <RegularText>
                        Lorem ipsum dolor sit amet, consectetur adip isicing
                        elit, sed do eiusm ut labore et dolore magna aliqua
                    </RegularText>
                </View>
>>>>>>> Add carousel to view past events and future events
            </View>
        </View>
    );
};

<<<<<<< HEAD
_renderTruncatedFooter = (handlePress) => {
    return (
        <Text style={{color: "#00A8A6", marginTop: 5}} onPress={handlePress}>
        READ MORE
        </Text>
    );
}

=======
>>>>>>> Add carousel to view past events and future events
export default ActivityCard;
