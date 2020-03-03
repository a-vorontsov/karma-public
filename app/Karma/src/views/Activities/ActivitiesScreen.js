import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Switch,
} from "react-native";
import Slider from "@react-native-community/slider";
import {RegularText} from "../../components/text";
import {GradientButton} from "../../components/buttons";
import PhotoUpload from "react-native-photo-upload";
import Styles from "../../styles/Styles";
import TextInput from "../../components/TextInput";
import Colours from "../../styles/Colours";

const {width, height} = Dimensions.get("window");

class ActivitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static navigationOptions = {
        headerShown: false,
    };
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Text>Activities</Text>
            </View>
        );
    }
}

export default ActivitiesScreen;
