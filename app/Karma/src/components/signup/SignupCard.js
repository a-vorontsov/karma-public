import React from "react";

import {
    View,
    Text,
} from "react-native";

import Title from "../Title";
import { GradientButton } from "../buttons";

import { useNavigation } from "react-navigation-hooks";

const SignupCard = (props) => {
    const navigation = useNavigation();
    if (props.individual) {
        return (
            <View>
                <Title>Are you an individual?</Title>
                <Text>This is some text that goes under the header</Text>
                <GradientButton title="Sign Up" onPress={() => navigation.navigate("UserSignUp")}/>
            </View>
        );
    } else {
        return (
            <View>
                <Title>Are you an organisation?</Title>
                <Text>This is some text that goes under the header</Text>
                <GradientButton title="Sign Up (org)" onPress={() => navigation.navigate("OrgSignUp")}/>
            </View>
        );
    }
}

export default SignupCard;
