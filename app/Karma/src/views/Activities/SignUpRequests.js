import React, {Component} from "react";
import {SafeAreaView, View} from "react-native";
import Styles from "../../styles/Styles";
import SignUpRequest from "../../components/activities/SignUpRequest";
import request from "superagent";
import {RegularText} from "../../components/text";
import {getAuthToken} from "../../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";
class SignUpRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signUpRequests: [],
        };
        this.getSignUps();
    }
    static navigationOptions = {
        headerShown: false,
    };

    componentDidMount() {
        const {navigation} = this.props;
        this.willFocusListener = navigation.addListener("willFocus", () => {
            this.getSignUps();
        });
    }
    componentWillUnmount() {
        this.willFocusListener.remove();
    }

    getSignUps = async () => {
        const {activity} = this.props;
        const authToken = await getAuthToken();
        const response = await request
            .get(`${REACT_APP_API_URL}/event/${activity.id}/signUp`)
            .set("authorization", authToken)
            .then(res => {
                return res.body.data;
            })
            .catch(err => {
                console.log(err);
            });
        let signUpRequests = [];
        Array.from(response.users).forEach(user => {
            //if confirmed == true/false then the user has already been accepted/rejected
            if (user.confirmed === null) {
                signUpRequests.push(user);
            }
        });

        this.setState({
            signUpRequests,
        });
    };

    /**
     * When a sign up request is confirmed/rejected, refetch the requests
     */
    onSubmit = () => {
        this.getSignUps();
    };

    render() {
        const {signUpRequests} = this.state;
        const {activity} = this.props;
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph16}>
                    {signUpRequests && signUpRequests.length > 0 ? (
                        signUpRequests.map(s => {
                            return (
                                <SignUpRequest
                                    navigation={this.props.navigation}
                                    user={s}
                                    key={s.userId}
                                    activity={activity}
                                    onSubmit={this.onSubmit}
                                />
                            );
                        })
                    ) : (
                        <RegularText>
                            Currently, there are no requests!
                        </RegularText>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

export default SignUpRequests;
