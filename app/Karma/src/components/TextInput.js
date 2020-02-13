import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';

const { width, height } = Dimensions.get("window");
const formWidth = 0.8 * width;

class TInput extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const {onChangeText} = this.props;    
return (
    <View>
    <TextInput
        style={this.props.showError ? [styles.textInput, styles.emptyInput] : styles.textInput }
        placeholder={this.props.placeholder}
        returnKeyType={this.props.keyType ? this.props.keyType : "default"}
        onChangeText={() => onChangeText()}
        // onPress={() => onPress()}
        ref={this.ref}
        // onSubmitEditing={() => onSubmitEditing()}
        ></TextInput>
    {this.props.showError ? <Text style={styles.errorText}>This field is required</Text> : <Text></Text>}
    </View>
)
    }
}


const styles = StyleSheet.create({
    textInput: {
        width: formWidth,
        height: 45,
        borderColor: 'transparent',
        borderBottomColor: '#D3D3D3',
        borderWidth: 1.5,
        marginTop: 5,
        marginBottom: 20,
        fontSize: 20,
        lineHeight: 20,
        color: '#7F7F7F',
        fontFamily: "Arial"
    },
    emptyInput: {
        borderBottomColor: "#e81f10",
        marginBottom: 10
    },
    errorText: {
        color: "#e81f10"
    }

})




export default TInput;