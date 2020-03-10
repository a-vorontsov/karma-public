import React from "react";
import {View, ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import PageHeader from "../components/PageHeader";
import {SubTitleText} from "../components/text";
import Styles, {normalise} from "../styles/Styles";
import {GradientButton} from "../components/buttons";
import CausePicker from "../components/causes/CausePicker";
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
    async selectCauses() {
        await request
            .post("http://localhost:8000/user/1/causes")
            .send({
                authToken: "ffa234124",
                userId: "1",
                causes: this.state.selectedCauses,
            })
            .then(res => {
                console.log(res.body.data);
            })
            .catch(er => {
                console.log(er);
            });
    }
    render() {
        const {causes} = this.state;
        return (
            <SafeAreaView style={Styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={[Styles.ph24, {marginBottom: 82}]}>
                    <View style={Styles.fullMinHeight}>
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
