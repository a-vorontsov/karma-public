import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";


class WelcomeScreen extends Component {
    static navigationOptions = { headerShown: false }
    render() {
        return (
            <View style={styles.container}>

                <View style={{ flex: 2, justifyContent: 'center' }}>
                    <Text style={[styles.text, { fontSize: 70 }]}>KARMA</Text>
                    <Text style={[styles.text, { fontSize: 40 }]}>lorem ipsum</Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 40 }}>
                    <TouchableOpacity style={[styles.button, { marginBottom: 20 }]} onPress={this._onPressButton}>
                        <Text style={[styles.text, { fontSize: 20 }]}>Sign Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this._onPressButton}>
                        <Text style={[styles.text, { fontSize: 15, fontWeight: '200' }]}>Already have an account? Login</Text>
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
        backgroundColor: '#03A8AE'
    },
    text: {
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
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

export default WelcomeScreen;