import React from "react";

import {TouchableOpacity, View} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";
import Colours from "../../styles/Colours";
import { Icon } from 'react-native-elements'

export default class SignUpRequest extends React.Component {
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
                    <View style={{flexDirection:"row", width: 80, justifyContent: "space-between"}}>
                        <TouchableOpacity>
                            <Icon
                                type="entypo"
                                name="check"
                                color="#62CD77"
                                // onPress={() => APPROVE}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon
                                name="close"
                                color="#E62A2A"
                                // onPress={() => DISAPPROVE}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}