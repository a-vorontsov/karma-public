import React from "react";

import {
    View,
    Image
} from "react-native";

import { GradientButton } from "../buttons";
import { RegularText, TitleText, SemiBoldText } from "../text";
import Styles from "../../styles/Styles";

import { useNavigation } from "react-navigation-hooks";

const SignupCard = (props) => {
    const navigation = useNavigation();
    return (
        <View style={[Styles.container, Styles.ph24]}>
            <View style={[Styles.pb24, Styles.bottom]}>
                <Image
                    source={
                        (props.individual) ?
                            require("../../assets/images/heart-hands.png")
                            :
                            require("../../assets/images/global-people.png")}
                    style={{ flex:1, width: null, height: null }}
                    resizeMode="contain"/>
                <View style={Styles.pv16}>
                    <SemiBoldText>
                        {(props.individual) ? "Are you an individual?" : "Are you an organisation?"}
                    </SemiBoldText>
                    <RegularText>Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusm  ut labore et dolore magna aliqua</RegularText>
                </View>
                <GradientButton title="Sign Up" onPress={() => navigation.navigate((props.individual) ? "UserSignUp": "OrgSignUp")}/>
            </View>
        </View>
    );
}

export default SignupCard;
