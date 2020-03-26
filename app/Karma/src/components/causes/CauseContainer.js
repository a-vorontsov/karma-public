import React from "react";
import {View, ScrollView, Dimensions} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Styles from "../../styles/Styles";
import {SubTitleText} from "../text";
import {GradientButton} from "../buttons";
import CausePicker from "./CausePicker";
import Toast from "react-native-simple-toast";
const request = require("superagent");
const {height: SCREEN_HEIGHT} = Dimensions.get("window");
import {getAuthToken} from "../../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";

export default class CauseContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            causes: [],
            selectedCauses: [],
        };
        this.selectCauses = this.selectCauses.bind(this);
        this.passUpState = this.passUpState.bind(this);
    }
    async componentDidMount() {
        try {
            let values = await AsyncStorage.multiGet([
                "causes",
                "ACCESS_TOKEN",
            ]);
            let causes = values[0][1];
            const authToken = values[1][1];
            causes = JSON.parse(causes);
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
                Toast.showWithGravity("Saved", Toast.SHORT, Toast.BOTTOM);
                this.props.onSubmit();
            })
            .catch(() => {
                this.props.onError(
                    "There was an issue saving your causes.",
                    "Please make sure that you're connected to the internet. Contact us if this issue persists.",
                );
            });
    }

    passUpState() {
        const {selectedCauses} = this.state;
        this.props.onUpdateCauses({
            selectedCauses,
            displayModal: false,
        });
        Toast.showWithGravity("Saved", Toast.SHORT, Toast.BOTTOM);
    }

    render() {
        const {causes} = this.state;
        return (
            <View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={[Styles.pv16, {maxHeight: SCREEN_HEIGHT * 0.6}]}>
                    {causes.length === 0 ? (
                        <SubTitleText style={Styles.textCenter}>
                            Loading...
                        </SubTitleText>
                    ) : (
                        <CausePicker
                            causes={causes}
                            onChange={items =>
                                (this.state.selectedCauses = items)
                            }
                        />
                    )}
                </ScrollView>
                <View style={[Styles.ph24, Styles.pt16, Styles.bgWhite]}>
                    <GradientButton
                        title="Save"
                        onPress={() =>
                            this.props.isActivity
                                ? this.passUpState()
                                : this.selectCauses()
                        }
                    />
                </View>
            </View>
        );
    }
}
