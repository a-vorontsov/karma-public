import React from "react";
import RegularText from "./RegularText";

import Styles from "../../styles/Styles";

export default class SubTitleText extends React.Component {
    render() {
        return (
            <RegularText
                style={[
                    Styles.large,
                    Styles.green,
                    Styles.pv16,
                    this.props.style,
                ]}>
                {this.props.children}
            </RegularText>
        );
    }
}
