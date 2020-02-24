import React from "react";

import {View, Image} from "react-native";

import {GradientButton} from "./buttons";
import {RegularText, SemiBoldText} from "./text";
import Styles from "../styles/Styles";

import {useNavigation} from "react-navigation-hooks";

const ActivityCard = props => {
    const navigation = useNavigation();
    return (
        <View style={[Styles.container, Styles.ph24]}>
            <View style={[Styles.pb24, Styles.bottom]}>
                <Image
                    source={
                        props.individual
                            ? require("../assets/images/general-logos/hands-heart.png")
                            : require("../assets/images/general-logos/globe.png")
                    }
                    style={{flex: 1, width: null, height: null}}
                    resizeMode="contain"
                />
                <View style={Styles.pv16}>
                    <RegularText>
                        Lorem ipsum dolor sit amet, consectetur adip isicing
                        elit, sed do eiusm ut labore et dolore magna aliqua
                    </RegularText>
                </View>
            </View>
        </View>
    );
};

export default ActivityCard;
