import React from "react";
import LinearGradient from "react-native-linear-gradient";
import {Image, View, TouchableOpacity} from "react-native";
import {RegularText} from "../text";
import {getCauseImage} from "./Causes";
import Colours from "../../styles/Colours";
import CauseStyles from "../../styles/CauseStyles";

export default class CauseItem extends React.Component {
    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
    }
    onPress() {
        if (this.props.isDisabled) {
            return;
        }
        const {cause} = this.props;
        this.props.onPress({
            name: cause.name,
            id: cause.id,
            title: cause.title,
        });
    }
    render() {
        const {cause, selected, display} = this.props;

        const ItemContent = (
            <>
                <View>
                    <Image
                        source={getCauseImage(cause.name, selected)}
                        style={CauseStyles.image}
                        resizeMode="contain"
                    />
                </View>
                <RegularText
                    style={
                        selected
                            ? CauseStyles.buttonTextSelected
                            : CauseStyles.buttonText
                    }>
                    {cause.title}
                </RegularText>
            </>
        );
        const CauseBox = selected ? (
            <LinearGradient
                useAngle={true}
                angle={45}
                angleCenter={{x: 0.5, y: 0.5}}
                colors={[Colours.blue, Colours.lightBlue]}
                style={
                    display
                        ? [CauseStyles.buttonDisplay, CauseStyles.shadow]
                        : [CauseStyles.button, CauseStyles.shadow]
                }>
                <RegularText style={CauseStyles.checkbox}>✓</RegularText>
                {ItemContent}
            </LinearGradient>
        ) : (
            <View
                style={
                    display
                        ? [CauseStyles.buttonDisplay, CauseStyles.shadow]
                        : [CauseStyles.button, CauseStyles.shadow]
                }>
                {ItemContent}
            </View>
        );

        return (
            <TouchableOpacity onPress={this.onPress} activeOpacity={0.9}>
                {CauseBox}
            </TouchableOpacity>
        );
    }
}
