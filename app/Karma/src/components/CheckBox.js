import React, { Component } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const LIGHT_GREY = "#d7dadb";
const BLACK = "#000";

class CheckBox extends Component {

    state = {
        isChecked: false
    }

    clicked = async() => {
        
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.setState({ isChecked: !this.state.isChecked })} style={this.props.style}>
                <View style={styles.checkBox}>
                    <View style={[styles.checked, { backgroundColor: this.state.isChecked ? BLACK : LIGHT_GREY}]}/>
                </View>
            </TouchableOpacity>
        )
    }

}


const styles = StyleSheet.create({
    checkBox: {
        height: 20,
        width: 20,
        borderWidth: 2,
        borderColor: "transparent",
        backgroundColor: LIGHT_GREY,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checked: {
        height:15, 
        width:15,
        borderRadius:3
    }
})

export default CheckBox;