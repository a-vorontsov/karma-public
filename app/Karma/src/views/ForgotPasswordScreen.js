import React, {Component} from "react";
import {
    View,

    Dimensions,
    SafeAreaView,
} from "react-native";

import Styles from "../styles/Styles";

import PageHeader from "../components/PageHeader";
import {TextInput} from "../components/input";
import ChangePasswordInput from "../components/input/ChangePasswordInput";
import {GradientButton} from "../components/buttons";


const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;
export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state={
            email: this.props.navigation.getParam("email"),
            isFirstOpened: true,
        };
    }
        render(){
            return(
            <SafeAreaView style={Styles.container}>

                <View
                    style={{
                        alignItems: "center",
                        height: 0.08 * SCREEN_HEIGHT,
                        justifyContent: "flex-start",
                }}>
                    <View style={{alignItems: "flex-start", width: FORM_WIDTH}}>
                        <PageHeader title="Forgot Password" />
                    </View>
                </View>
                <View style={{alignItems:"center", flex:1}}>
                    <View style={{flex:1}}>
                        <TextInput
                            placeholder={this.state.email}
                            autoCapitalize="none"
                            name="email"
                            onChange={this.onChangeText}
                            showError={false}
                            editable={false}
                        />
                        <ChangePasswordInput 
                        firstOpen={this.state.isFirstOpened}
                        />
                    </View>
                    <View style={{width: FORM_WIDTH,justifyContent: "flex-end", marginBottom:20}} >
                        <GradientButton onPress={() => this.setState({isFirstOpened:false})}
                                    title="Submit"
                                    
                                /> 
                            </View>                     
                    </View>
            </SafeAreaView>)
        }
}
