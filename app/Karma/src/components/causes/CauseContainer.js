import React from "react";
import {View, ScrollView, Dimensions} from "react-native";
import Styles from "../../styles/Styles";
import {SubTitleText} from "../text";
import {GradientButton} from "../buttons";
import CausePicker from "./CausePicker";
import Toast from "react-native-simple-toast";
const request = require("superagent");
const {height: SCREEN_HEIGHT} = Dimensions.get("window");
import {getData} from "../../util/credentials";

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
            const response = await request.get("http://localhost:8000/causes");
            this.setState({
                causes: response.body.data,
            });
        } catch (error) {
            console.log(error);
        }
    }
    async selectCauses() {
        const credentials = await getData();
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

    passUpState(){
        const {selectedCauses} = this.state;
        this.props.onUpdateCauses({
            selectedCauses,
            displayModal: false
        })
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
                        onPress={() => this.props.isActivity ? this.passUpState() : this.selectCauses()}
                    />
                </View>
            </View>
        );
    }
}
