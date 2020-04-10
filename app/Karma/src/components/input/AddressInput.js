import React from "react";
import Styles from "../../styles/Styles";
import TextInput from "./TextInput";
import {Keyboard, View} from "react-native";

const POSTCODE_REGEX = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/;

/*
   The AddressInput class is a component which is used whenever
   the user is required to provide an address.
*/

export default class AddressInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address1: props.address1,
            address2: props.address2,
            city: props.city,
            region: props.region,
            postcode: props.postcode,
            correctPostCode: true,
        };
        this.onChangeText = this.onChangeText.bind(this);
        this.testPostCode = this.testPostCode.bind(this);
        this.passUpState = this.passUpState.bind(this);
    }
    testPostCode() {
        const correctPostCode = POSTCODE_REGEX.test(this.state.postcode);
        this.setState({
            correctPostCode,
        });
    }

    // Passes the states of certain flags up to the parent
    // container this component is used in.
    passUpState() {
        const {
            address1,
            address2,
            city,
            region,
            postcode,
            correctPostCode,
        } = this.state;
        if (address1 && city && region && correctPostCode) {
            this.props.onChange({
                address1,
                address2,
                city,
                region,
                postcode,
                valid: true,
            });
        }
    }
    onChangeText(event) {
        const {name, text} = event;
        this.setState({
            [name]: text,
        });
    }
    render() {
        const {correctPostCode} = this.state;
        return (
            <View>
                <TextInput
                    inputRef={ref => (this.address1 = ref)}
                    value={this.state.address1}
                    style={Styles.textInput}
                    placeholder="Address Line 1"
                    autoCapitalize="words"
                    autoCompleteType="street-address"
                    name="address1"
                    onChange={this.onChangeText}
                    onSubmitEditing={() => {
                        this.address2.focus();
                    }}
                    onBlur={this.passUpState}
                    showError={this.state.address1 === ""}
                />
                <TextInput
                    inputRef={ref => (this.address2 = ref)}
                    value={this.state.address2}
                    style={Styles.textInput}
                    placeholder="Address Line 2"
                    autoCapitalize="words"
                    name="address2"
                    onChange={this.onChangeText}
                    onSubmitEditing={() => {
                        this.city.focus();
                    }}
                    onBlur={this.passUpState}
                />
                <TextInput
                    inputRef={ref => (this.city = ref)}
                    value={this.state.city}
                    style={Styles.textInput}
                    placeholder="Town/City"
                    autoCapitalize="words"
                    name="city"
                    onChange={this.onChangeText}
                    onSubmitEditing={() => {
                        this.region.focus();
                    }}
                    onBlur={this.passUpState}
                    showError={this.state.city === ""}
                />
                <TextInput
                    inputRef={ref => (this.region = ref)}
                    value={this.state.region}
                    style={Styles.textInput}
                    placeholder="County/Region"
                    autoCapitalize="words"
                    name="region"
                    onChange={this.onChangeText}
                    onSubmitEditing={() => {
                        this.postCode.focus();
                    }}
                    onBlur={this.passUpState}
                    showError={this.state.region === ""}
                />
                <TextInput
                    inputRef={ref => (this.postCode = ref)}
                    value={this.state.postcode}
                    style={Styles.textInput}
                    placeholder="Post Code"
                    autoCapitalize="characters"
                    autoCompleteType="postal-code"
                    name="postcode"
                    onChange={this.onChangeText}
                    onSubmitEditing={() => {
                        this.testPostCode();
                        Keyboard.dismiss();
                    }}
                    onBlur={() => {
                        this.testPostCode();
                        this.passUpState();
                    }}
                    showError={!correctPostCode}
                    errorText="Incorrect postcode format"
                />
            </View>
        );
    }
}
