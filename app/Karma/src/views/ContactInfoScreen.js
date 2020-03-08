import React from "react";
import {Text} from "react-native";

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

export default ContactInfoScreen;
