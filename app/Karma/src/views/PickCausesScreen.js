import React from "react";
import {View, ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import PageHeader from "../components/PageHeader";
import {SubTitleText} from "../components/text";
import Styles, {normalise} from "../styles/Styles";
import {GradientButton} from "../components/buttons";
import CausePicker from "../components/causes/CausePicker";

export default class PickCausesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            causes: [],
        };
        const causes = [
            {name: "animals", title: "Animals"},
            {name: "arts", title: "Arts & Culture"},
            {name: "community", title: "Community"},
            {name: "conservation", title: "Conservation"},
            {name: "crisis", title: "Crisis"},
            {name: "education", title: "Education"},
            {name: "energy", title: "Energy"},
            {name: "equality", title: "Equality"},
            {name: "food", title: "Food"},
            {name: "health", title: "Health"},
            {name: "homelessness", title: "Homelessness"},
            {name: "peace", title: "Peace & Justice"},
            {name: "poverty", title: "Poverty"},
            {name: "refugees", title: "Refugees"},
            {name: "religious", title: "Religious"},
        ];
        this.state.causes = causes;
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
                                onChange={items => console.log(items)}
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
                    <GradientButton title="Next" />
                </View>
            </SafeAreaView>
        );
    }
}
