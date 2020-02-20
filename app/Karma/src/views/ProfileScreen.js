import React, {Component} from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, Image, Platform, ScrollView, BackHandler,} from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import { RegularText, TitleText, SemiBoldText, LogoText } from "../components/text";
import { GradientButton } from "../components/buttons";

const { width, height } = Dimensions.get("window")
const formWidth = 0.8 * width;

class ProfileScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            // {this.props.navigation.getParam('name', null)}
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#00A8A6',
                    height: 260,
                    width: width,
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    flexDirection: "row"
                }}>
                <Image
                    style={{
                    paddingVertical: 10,
                    width: 130,
                    height: 130,
                    borderRadius: 75,
                    }}
                    resizeMode='cover'
                    source={require('../assets/color.png')}
                />
                <View>
                    <RegularText style={styles.nameText}>Name</RegularText>
                    <View
                        style={{
                            flexDirection: "row"
                        }}>
                        <Text style={styles.usernameText}>Username</Text>
                        <Text style={styles.locationText}>Location</Text>
                    </View>
                </View>
            </View>
            <View
                style={{
                    flex: 5,
                    backgroundColor:"white",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 25
                }}>
                <GradientButton title='Create Activity' width={350}></GradientButton>
                <View style={{flex:1, alignItems: "flex-start", justifyContent: "flex-start", paddingTop: 20}}>
                    <RegularText>Activity</RegularText>
                    <RegularText>Bio</RegularText>
                    <RegularText>Causes</RegularText>
                </View>
            </View>
            </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    nameText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold'
    },
    usernameText: {
        fontSize: 20,
        color: 'white',
    },
    locationText: {
        fontSize: 20,
        color: '#75C4C3',
        paddingLeft: 10
    }

})

export default ProfileScreen;
