import React from "react";

import {View, Image} from "react-native";

import {GradientButton} from "./buttons";
import {RegularText, SemiBoldText} from "./text";
import Styles from "../styles/Styles";

import {useNavigation} from "react-navigation-hooks";

const icons = {
    fave_inactive: require("../assets/images/general-logos/fav-outline-profile.png"),
}

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
                <View>
                    <RegularText style={{fontWeight:'500', fontSize: 20}}>
                        Activity Name
                    </RegularText>
                </View>
                <View>
                    <RegularText>
                        Activity description, consectetur adip isicing
                        elit, sed do eiusm ut labore et dolore magna aliqua
                    </RegularText>
                </View>
            </View>
        </View>
    );
};

export default ActivityCard;
