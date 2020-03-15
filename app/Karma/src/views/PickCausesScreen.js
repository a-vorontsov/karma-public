/* eslint-disable react/no-did-mount-set-state */
import React from "react";
import {View, ScrollView, Alert} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import PageHeader from "../components/PageHeader";
import {SubTitleText} from "../components/text";
import Styles, {normalise} from "../styles/Styles";
import {GradientButton} from "../components/buttons";
import CausePicker from "../components/causes/CausePicker";
import * as Keychain from "react-native-keychain";
const request = require("superagent");

export default class PickCausesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            causes: [],
            selectedCauses: [],
        };
        this.selectCauses = this.selectCauses.bind(this);
    }
    async componentDidMount() {
        try {

           
            const response = await request.get("http://localhost:8000/causes");
            this.setState({
                causes: response.body.data,
            });
        } catch (error) {
            console.log(error);
        }
    }

    getData = async () => {
        try {
            // Retreive the credentials
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                console.log(
                    "Credentials successfully loaded for user " +
                        credentials.username,
                );
                return credentials;
            } else {
                console.log("No credentials stored");
            }
        } catch (error) {
            console.log("Keychain couldn't be accessed!", error);
        }
    };

    async selectCauses() {
        const credentials = await this.getData();
        const authToken = credentials.password;
        const userId = credentials.username;
        await request
            .post("http://localhost:8000/causes/select")
            .send({
                authToken: authToken,
                userId: userId,
                data: {causes: this.state.selectedCauses},
            })
            .then(res => {
                console.log(res.body.data);
                this.props.navigation.navigate("Activities");
            })
            .catch(err => {
                Alert.alert("Server Error", err.message);
            });
    }
    //TODO display selected causes already from db
    render() {
        const {causes} = this.state;
        return (
            <SafeAreaView style={Styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={[Styles.ph24, {marginBottom: 82}]}>
                    <View>
                        <>
                            <PageHeader title="Causes" />
                            <SubTitleText style={{fontSize: normalise(24)}}>
                                What causes do you care about?
                            </SubTitleText>
                        </>
                        <>
                            <CausePicker
                                causes={causes}
                                onChange={items =>
                                    (this.state.selectedCauses = items)
                                }
                            />
                        </>
                    </View>
                </ScrollView>
                <View
                    style={[
                        Styles.stickyBottom,
                        Styles.ph24,
                        Styles.pv16,
                        Styles.bgWhite,
                    ]}>
                    <GradientButton
                        title="Next"
                        onPress={() => this.selectCauses()}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
