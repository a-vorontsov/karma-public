import React from "react";

import {TouchableOpacity, View} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";
import Colours from "../../styles/Colours";
import ProfileScreen from "../../views/ProfileScreen"
import { Icon } from 'react-native-elements'
import Communications from "react-native-communications";

export default class AttendeeButton extends React.Component {
    render() {
        const {user} = this.props;
        return (
            <View style={[Styles.pv8]}>
                <View
                style={[Styles.pv8, {flexDirection: "row", paddingRight:20, justifyContent: "space-between", backgroundColor:Colours.white, borderWidth: 3, borderColor: Colours.grey}]}
                activeOpacity={0.9}>
                    <TouchableOpacity>
                        <RegularText style={[Styles.ph8, {fontSize:20}]}>
                            {user}
                        </RegularText>

                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon
                            name="email"
                            color={Colours.blue}
                            onPress={() =>
                                Communications.email(
                                    ["userEmail"],
                                    null,
                                    null,
                                    null,
                                    null,
                                )}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
