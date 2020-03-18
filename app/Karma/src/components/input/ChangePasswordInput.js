import React, {Component} from "react";
import {
    View,
    StyleSheet,
    Keyboard,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import {TextInput} from "../input";
import {RegularText} from "../text";
import Styles from "../../styles/Styles";
import SignUpStyles from "../../styles/SignUpStyles";

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default class ChangePasswordInput extends Component {
    constructor(props) {
        super(props);
        this.state={
            hidePassword: true,
            firstOpen: this.props.firstOpen,
            showError: false,
            passwordMatch: true,
            password: "",
            confPassword: "",
        };
        this.onChangeText = this.onChangeText.bind(this);

    }
    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
        
    };

    isValidPassword(){
        if(!PASSWORD_REGEX.test(this.state.password) || !this.state.password){
            return false;
        }
        else{
            return true;
        }
    }

    showError(){
        console.log("in show err")
        // it's the first time you open the page
        if (this.state.firstOpen){
           return false;
        }
        // password is of an invalid format OR empty
        if(!this.isValidPassword()){
                return true;
            }
        // passwords don't match 
        if(this.state.password !== this.state.confPassword){
                this.setState({passwordMatch:false})
                console.log("no")

                return true;
            }
        }

    whichErrorText(){
        if(!this.state.passwordMatch){
            console.log("sad")
            return "Passwords must match";
        }
        else{
            return "Invalid Password Format";
        }
    }

    getInnerRef = () => this.ref; // allows focus

    render() {
        const showError = this.showError()
        console.log(showError)
        return(
        <View>
            <TextInput 
                placeholder="Password"
                autoCapitalize="none"
                name="password"
                secureTextEntry={
                    this.state.hidePassword
                }
                blurOnSubmit={false}
                onChange={this.onChangeText}
                showError={showError} 
                errorText={this.whichErrorText()}
                
                inputRef={ref => (this.password = ref)} // let other components know what the password field is defined as
                onSubmitEditing={() =>
                    this.confPassword.focus()
                }
                returnKeyType="next"
            />
            <TouchableOpacity
                onPress={() =>
                    this.setState({
                        hidePassword: !this.state
                            .hidePassword,
                    })
                }
               >
                <RegularText >
                    Show
                </RegularText>
            </TouchableOpacity>

            <TextInput ref={(input) => { this.confPassword = input; }}
                placeholder="Confirm Password"
                name="confPassword"
                autoCapitalize="none"
                blurOnSubmit={false}
                inputRef={ref =>
                    (this.confPassword = ref)
                }
                onSubmitEditing={() =>
                    {Keyboard.dismiss(); console.log("ooooo")}
                }
                secureTextEntry={
                    this.state.hidePassword
                }
                returnKeyType="default"
                onChange={this.onChangeText}
                
                showError={showError}
                errorText={this.whichErrorText()}
                />

                <TouchableOpacity
                    onPress={() => this.setState({hidePassword: !this.state.hidePassword,})}>
                    <RegularText >
                        Show
                    </RegularText>
                </TouchableOpacity>
        </View>
        );
        
    }}


    