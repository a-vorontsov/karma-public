import React from "react";
import {SubTitleText, RegularText, BoldText} from "../text";
import {TransparentButton, Button} from "../buttons";
import { View } from "react-native";

export default class SignUpActivity extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View>
                <SubTitleText>Almost signed up!</SubTitleText>
                <RegularText>{"asdf"}</RegularText>
                <TransparentButton title="Add to Calendar"/>
                <Button title="Confirm"/>
            </View>
        );
    }
}
