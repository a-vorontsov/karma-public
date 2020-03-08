import React from "react";

import {TouchableOpacity, View, Image} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";
import Colours from "../../styles/Colours";
import ProfileScreen from "../../views/ProfileScreen"
import Communications from "react-native-communications";

const icons = {
    email: require("../../assets/images/general-logos/mail.png"),
};

export default class AttendeeButton extends React.Component {
    render() {
        const {user} = this.props;
        return (
            <View style={[Styles.pv8]}>
                <View
                style={[Styles.pv8, {flexDirection: "row", justifyContent: "space-between", backgroundColor:Colours.white, borderWidth: 3, borderColor: Colours.grey}]}
                activeOpacity={0.9}>
                    <TouchableOpacity>
                        <RegularText style={[Styles.ph8, {fontSize:20}]}>
                            {user}
                        </RegularText>

                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 30, paddingRight: 15, justifyContent:"flex-end", alignItems: "flex-end"}}>
                        <Image
                            source={icons.email}
                            onPress={() =>
                                Communications.email(
                                    ["userEmail"],
                                    null,
                                    null,
                                    null,
                                    null,
                                )}
                            style={{height:30, alignSelf: "center", justifyContent:"flex-end"}}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
