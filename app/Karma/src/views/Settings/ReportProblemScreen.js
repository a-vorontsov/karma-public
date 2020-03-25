import React, {Component} from "react";
import {
    Dimensions,
    Image,
    Keyboard,
    SafeAreaView,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import {TransparentButton} from "../../components/buttons";
import {Dropdown} from "react-native-material-dropdown";
import {TextInput} from "../../components/input";
import {getAuthToken} from "../../util/credentials";
import Toast from "react-native-simple-toast";
import Colours from "../../styles/Colours";
import {REACT_APP_API_URL} from "react-native-dotenv";

const request = require("superagent");

const logo = require("../../assets/images/settings-logos/report-problem.png");

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const FORM_WIDTH = SCREEN_WIDTH - 45;

const problemTypes = [
    {value: "I have a problem with my account"},
    {value: "I have a problem with the app / interface"},
    {value: "I have a problem with an event"},
    {value: "Other"},
];

class ReportProblemScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            category: problemTypes[0].value,
            problem: "",
            user: props.navigation.getParam("user"),
        };
        this.submitBugReport = this.submitBugReport.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    async submitBugReport() {
        const {navigate} = this.props.navigation;
        const authToken = await getAuthToken();
        Toast.showWithGravity("Sending report...", 1, Toast.BOTTOM);
        request
            .post(`${REACT_APP_API_URL}/bugreport`)
            .set("authorization", authToken)
            .send({
                data: {
                    email: this.state.user.email,
                    report: this.state.category + ": " + this.state.problem,
                },
            })
            .then(res => {
                console.log(res.body.message);
                Toast.showWithGravity(
                    "Your report has been sent.",
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                navigate("SettingsMenu", {
                    user: this.state.user,
                });
            })
            .catch(er => {
                console.log(er.message);
            });
    }

    onChangeText(event) {
        const {name, text} = event;
        this.setState({
            [name]: text,
        });
    }
    render() {
        return (
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}>
                <SafeAreaView style={[Styles.container, Styles.ph24]}>
                    <View style={Styles.ph24}>
                        <PageHeader title="Report a Problem" />
                    </View>
                    <View style={Styles.ph24}>
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 30,
                            }}>
                            <Image source={logo} />
                        </View>
                        <Dropdown
                            label="Problem Category"
                            containerStyle={{width: FORM_WIDTH}}
                            baseColor={Colours.blue}
                            textColor={Colours.black}
                            itemTextStyle={{fontFamily: "OpenSans-Regular"}}
                            value={this.state.category}
                            data={problemTypes}
                            animationDuration={200}
                            onChangeText={value =>
                                this.setState({category: value})
                            }
                        />
                        <RegularText style={[Styles.pb24, {paddingTop: 20}]}>
                            Describe your problem:
                        </RegularText>
                        <TextInput
                            inputRef={ref =>
                                (this.problemDescriptionInput = ref)
                            }
                            placeholder="I encountered X on screen Y..."
                            returnKeyType="next"
                            onChange={this.onChangeText}
                            onKeyPress={this.onKeyPress}
                            onSubmitEditing={Keyboard.dismiss()}
                            multiline={true}
                            style={{
                                margin: 0,
                                fontSize: 18,
                                borderWidth: 1,
                                borderColor: Colours.blue,
                                padding: 10,
                                height: 200,
                                width: FORM_WIDTH,
                                borderRadius: 10,
                            }}
                            name="problem"
                        />
                        <RegularText
                            style={[Styles.pb24, {color: Colours.grey}]}>
                            When you submit a report, we may contact you at:
                        </RegularText>
                        <TextInput
                            value={this.state.user.email}
                            name="email"
                            editable={false}
                        />
                        <View style={[Styles.ph24, Styles.pb24, Styles.pt8]}>
                            <TransparentButton
                                onPress={this.submitBugReport}
                                styles={[Styles.white, {color: Colours.blue}]}
                                title="Submit Bug Report"
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    }
}

export default ReportProblemScreen;
