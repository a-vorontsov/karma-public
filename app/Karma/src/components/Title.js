import React from "react";
import {Text} from "react-native";
import Styles from "../styles/Styles";

const Title = (props) => {
    return (
        <Text style={Styles.title}>
            {props.children}
        </Text>
    );
}

export default Title;
