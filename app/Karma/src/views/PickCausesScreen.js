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
            let causes = await AsyncStorage.getItem("causes");
            causes = JSON.parse(causes);
            const authToken = await getAuthToken();
            if (causes.length === 0) {
                request
                    .get(`${REACT_APP_API_URL}/causes`)
                    .set("authorization", authToken)
                    .then(res => {
                        causes = res.body.data;
                    });
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
