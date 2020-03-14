import React from "react";

import {TouchableOpacity, Image} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";

const icons = {
    facebook: require("../../assets/images/general-logos/facebook-logo.png"),
    linkedin: require("../../assets/images/general-logos/linkedin-logo.png"),
    twitter: require("../../assets/images/general-logos/twitter-logo.png"),
    link: require("../../assets/images/general-logos/copy-link.png"),
};

export default class ShareButton extends React.Component {
    render() {
        const {onPress, title, white, size, ph, icon} = this.props;
        return (
            <TouchableOpacity
                style={[
                    Styles.roundButton,
                    white
                        ? Styles.roundButtonTransparentWhite
                        : Styles.roundButtonTransparent,
                ]}
                onPress={onPress}
                activeOpacity={0.9}>
                <Image
                    source={icons[icon]}
                    style={{
                        width: 24,
                        height: 24,
                        position: "absolute",
                        left: 16,
                        top: 10,
                    }}
                />
                <RegularText
                    style={[
                        {fontSize: size, paddingHorizontal: ph},
                        white ? Styles.white : Styles.green,
                    ]}>
                    {title}
                </RegularText>
            </TouchableOpacity>
        );
    }
    static defaultProps = {
        size: 20,
        ph: 0,
    };
}
