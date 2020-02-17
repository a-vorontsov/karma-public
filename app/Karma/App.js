import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import WelcomeScreen from "./src/views/WelcomeScreen";
import InitSignUpScreen from "./src/routes/InitSignupScreen";
import UserSignUpScreen from "./src/views/UserSignUpScreen";
import OrgSignUpScreen from "./src/views/OrgSignUpScreen";

const MainNavigator = createStackNavigator(
    {
        Welcome: {screen: WelcomeScreen},
        InitSignup: {screen: InitSignUpScreen},
        UserSignUp: {screen: UserSignUpScreen},
        OrgSignUp: {screen: OrgSignUpScreen},
    },
    {
        headerMode: "none",
        defaultNavigationOptions: {
            cardStyle: {
                backgroundColor: "#f8f8f8",
            },
        },
    },
);

const App = createAppContainer(MainNavigator);

export default App;
