import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";



class LoginScreen extends Component {
    static navigationOptions = { headerShown: false }
    render() {
        return (
            <View style={styles.container}>

                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 40 }}>
                    <TouchableOpacity style={[styles.button, { marginBottom: 20 }]} onPress={this._onPressButton}>
                        <Text style={[styles.text, { fontSize: 20 }]}>Login</Text>
                    </TouchableOpacity>
                </View>

            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    text: {
        justifyContent: 'center',
        textAlign: 'center',
        color: 'black'
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 30,
        paddingHorizontal: 125,
        paddingVertical: 10
    }
})
export default LoginScreen;