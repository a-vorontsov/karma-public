import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    Linking,
    TouchableOpacity,
    KeyboardAvoidingView,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import CheckBox from '../components/CheckBox';
import { ScrollView } from "react-native-gesture-handler";
import Tooltip from 'react-native-walkthrough-tooltip';
import TextInput from '../components/TextInput';


const linkColour = '#3bbfb2';
const { width, height } = Dimensions.get("window")
const formWidth = 0.8 * width;
const textColour = "#7F7F7F";

class SignUpScreen extends React.Component {
    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props)
        this.animatedValue = new Animated.Value(0)
        this.state = {
            fname: "",
            lname: "",
            email: "",
            username: "",
            password: "",
            conf_password: "",
            hide_password: true,
            terms_checked: false,
            toolTipVisible: true,
            firstOpen: true
        }
       
    }

    

    

    modifyState = (key, val) => {
        console.log([key])
        this.setState({ [key]: val })
    }

    shakeInputs = () => {
        Animated.loop(
            // Animation consists of a sequence of steps
            Animated.sequence([
                // start rotation in one direction (only half the time is needed)
                Animated.timing(this.animatedValue, { toValue: 1.0, duration: 30, easing: Easing.linear, useNativeDriver: true }),
                // rotate in other direction, to minimum value (= twice the duration of above)
                Animated.timing(this.animatedValue, { toValue: -1.0, duration: 60, easing: Easing.linear, useNativeDriver: true }),
                // return to begin position
                Animated.timing(this.animatedValue, { toValue: 0.0, duration: 30, easing: Easing.linear, useNativeDriver: true })
            ])
            , { iterations: 2 }).start();



    }


    signUserUp = () => {
        const { fname, lname, email, username, password, conf_password } = this.state;
        this.setState({ firstOpen: false })

    }

    render() {
        console.log(this.state.fname)
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ alignItems: "center" }}>
                        {/** Header **/}
                        <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 70, alignItems: "flex-start", width: formWidth }}>
                            <View style={styles.header}>
                                <TouchableOpacity>

                                    <Text style={{ color: linkColour, fontSize: 30 }}>←</Text>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>Sign Up</Text>
                            </View>
                            <Text style={styles.subheaderText}>Create a new account</Text>
                        </View>
                    </View>

                    {/** form content **/}
                    <View style={{ justifyContent: 'space-evenly', alignItems: 'center', height: 0.60 * height, width: width }}>


                        <TextInput
                            style={styles.textInput}

                            placeholder='First Name'
                            onChangeText={(text) => this.setState({ fname: text})}

                            onSubmitEditing={() => this.secondInput.focus()}
                            showError={this.state.firstOpen ? false : this.state.fname}
                            returnKeyType="next"
                        />
                        <Text>{this.state.fname}</Text>


                        <TextInput

                            ref={ref => {
                                this.secondInput = ref;
                            }}
                            style={styles.textInput}
                            placeholder='Last Name'
                            autoCapitalize="none"
                            onChangeText={val => this.onChangeText('lname', val)}
                            onSubmitEditing={() => this.thirdInput.focus()}
                            returnKeyType="next"

                        />


                        <TextInput
                            ref={ref => {
                                this.thirdInput = ref;
                            }}
                            style={styles.textInput}
                            placeholder='Email'
                            autoCapitalize="none"
                            onChangeText={val => this.onChangeText('email', val)}
                            onSubmitEditing={() => this.fourthInput.focus()}
                            returnKeyType="next"
                        />


                        <TextInput
                            ref={ref => {
                                this.fourthInput = ref;
                            }}
                            style={styles.textInput}
                            placeholder='Choose a username'
                            autoCapitalize="none"
                            onChangeText={val => this.onChangeText('username', val)}
                            onSubmitEditing={() => this.fifthInput.focus()}
                            returnKeyType="next"
                        />



                        <View style={{ flexDirection: 'row' }}>

                            <TextInput
                                ref={ref => {
                                    this.fifthInput = ref;
                                }}
                                style={styles.textInput}
                                placeholder='Password'
                                autoCapitalize="none"
                                secureTextEntry={this.state.hide_password}
                                blurOnSubmit={false}
                                onChangeText={val => this.onChangeText('password', val)}
                                onSubmitEditing={() => this.sixthInput.focus()}
                                returnKeyType="next"
                            />
                            <TouchableOpacity onPress={() => this.setState({ hide_password: !this.state.hide_password })} style={{ position: 'absolute', top: 15, right: 0 }}>
                                <Text style={{ color: linkColour }}>Show</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                ref={ref => {
                                    this.sixthInput = ref;
                                }}
                                style={styles.textInput}
                                placeholder='Confirm Password'
                                autoCapitalize="none"
                                blurOnSubmit={false}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                secureTextEntry={this.state.hide_password}
                                onChangeText={val => this.onChangeText('conf_password', val)}
                            />
                            <TouchableOpacity onPress={() => this.setState({ hide_password: !this.state.hide_password })} style={{ position: 'absolute', top: 15, right: 0 }}>
                                <Text style={{ color: linkColour }}>Show</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    {/** Footer **/}
                    <View style={{ alignItems: "center", flex: 1, justifyContent: "flex-end", }}>
                        <View style={styles.footer}>
                            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                <CheckBox
                                    style={styles.checkBox}
                                    value={this.state.terms_checked}
                                    onValueChange={() => this.setState({ terms_checked: !this.state.terms_checked })}
                                /><Text style={{ flexShrink: 1, color: textColour }}>
                                    <Text>By creating an account,
                                you agree to all the legal stuff: </Text>
                                    <Text style={{ color: linkColour, textDecorationLine: 'underline' }}
                                        onPress={() => Linking.openURL('http://google.com')}>Terms of Use</Text>
                                    <Text> {'&'} </Text>
                                    <Text style={{ color: linkColour, textDecorationLine: 'underline' }}
                                        onPress={() => Linking.openURL("http://google.com")}>Privacy</Text>
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={this.signUserUp}
                            >
                                <Text style={{ color: 'white', textAlign: 'center' }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

            </KeyboardAvoidingView>
        )
    }
}


const styles = StyleSheet.create({


    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerText: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'black',
        paddingLeft: 10

    },
    subheaderText: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        textAlignVertical: 'top',
        textAlign: 'left',
        paddingTop: 20,
        paddingBottom: 50,
        color: '#3bbfb2'

    },
    checkBox: {
        paddingRight: 20
    },

    container: {
        flex: 1,
        alignItems: 'center',

    },
    textInput: {
        width: formWidth,
        height: 45,
        borderColor: 'transparent',
        borderBottomColor: '#D3D3D3',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 20,
        fontSize: 20,
        lineHeight: 20,
        color: '#7F7F7F',
        fontFamily: "Arial"
    },
    footer: {
        width: formWidth,
        justifyContent: "flex-end"
    },
    submitButton: {
        backgroundColor: '#3bbfb2',
        paddingHorizontal: 30,
        paddingVertical: 15,
        marginTop: 15,
        borderRadius: 30,
        width: formWidth
    }
})


export default SignUpScreen;