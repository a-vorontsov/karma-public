import React from "react";
import {
    View,
    Text,
    Image,
    Alert,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    TouchableOpacity,
} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import PhotoUpload from "react-native-photo-upload";
import {
    RegularText,
    TitleText,
    SemiBoldText,
    LogoText,
} from "../components/text";

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

class ContactInfoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: null,
            city: null,
            state: null,
            postcode: null,
            phone: null,
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    goToPrevious() {
        this.props.navigation.navigate("AboutScreen");
    }

    goToNext() {}

    render() {
        return <Text>Contact Info Screen</Text>;
    }
}

const styles = StyleSheet.create({});

export default ContactInfoScreen;
