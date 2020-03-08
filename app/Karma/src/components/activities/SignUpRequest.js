import React from "react";

import {TouchableOpacity, View} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";
import Colours from "../../styles/Colours";

export default class SignUpRequest extends React.Component {
    render() {
        const {user} = this.props;
        return (
            <View style={Styles.pv8}>
                <TouchableOpacity
                style={[Styles.pv8, {backgroundColor:Colours.white, borderWidth: 3, borderColor: Colours.grey}]}
                activeOpacity={0.9}>
                    <RegularText style={[Styles.ph8, {fontSize:20}]}>
                        {user}
                    </RegularText>
                </TouchableOpacity>
            </View>
        );
    }
}