import React from "react";
import {View} from "react-native";
import RadioButton from "./RadioButton";

import RadioButtonStyles from "../../styles/RadioButtonStyles";

export default class RadioInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
        this.onValue = this.onValue.bind(this);
    }

    onValue(event) {
        this.setState({
            value: event,
        });
        this.props.onValue(event);
    }

    render() {
        const {values} = this.props;
        return (
            <View style={RadioButtonStyles.container}>
                {values.map(value => {
                    if (typeof value === "object") {
                        return (
                            <RadioButton
                                key={value.value}
                                value={value.value}
                                title={value.title}
                                selected={this.state.value === value.value}
                                onValue={this.onValue}
                            />
                        );
                    } else {
                        return (
                            <RadioButton
                                key={value}
                                value={value}
                                title={value}
                                selected={this.state.value === value}
                                onValue={this.onValue}
                            />
                        );
                    }
                })}
            </View>
        );
    }
}
