import React from "react";
import {View, ScrollView, Alert} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-community/async-storage";
import PageHeader from "../components/PageHeader";
import {SubTitleText} from "../components/text";
import Styles, {normalise} from "../styles/Styles";
import {GradientButton} from "../components/buttons";
import CausePicker from "../components/causes/CausePicker";
import {getAuthToken} from "../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";
import Toast from "react-native-simple-toast";

const request = require("superagent");

/**
 *  @class PickCausesScreen allows a user to select their preferred causes.
 *  Fetches the already selected causes and updates the new causes selected.
 */
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
            let causes = await AsyncStorage.getItem("causes");
            causes = JSON.parse(causes);
            const authToken = await getAuthToken();

            //fetch the causes that the user has already selected and display them as such
            await request
                .get(`${REACT_APP_API_URL}/profile/causes`)
                .set("authorization", authToken)
                .then(res => {
                    this.setState({
                        selectedCauses: res.body.data,
                    });
                })
                .catch(err => {
                    console.log(err);
                });

            if (causes.length === 0) {
                const res = await request
                    .get(`${REACT_APP_API_URL}/causes`)
                    .set("authorization", authToken);
                causes = res.body.data;
            }
            this.setState({
                causes,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async selectCauses() {
        const authToken = await getAuthToken();

        request
            .post(`${REACT_APP_API_URL}/causes/select`)
            .set("authorization", authToken)
            .send({
                data: {causes: this.state.selectedCauses},
            })
            .then(res => {
                console.log(res.body.message);
                Toast.showWithGravity(
                    "Causes selected!",
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                this.props.navigation.navigate("Main");
            })
            .catch(err => {
                Alert.alert("Server Error", err.message);
            });
    }

    render() {
        const {causes, selectedCauses} = this.state;
        return (
            <SafeAreaView style={Styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={[Styles.ph24, {marginBottom: 82}]}>
                    <View>
                        <>
                            <PageHeader title="Causes" disableBack={true} />
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
                                selectedCauses={selectedCauses}
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
                        title={
                            this.props.navigation.getParam("isSignup")
                                ? "Next"
                                : "Update"
                        }
                        onPress={() => this.selectCauses()}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
