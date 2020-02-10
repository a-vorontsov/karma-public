import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
<<<<<<< HEAD
import HomeScreen from "./src/routes/HomeScreen";
import InitSignupScreen from "./src/routes/InitSignupScreen";
=======
import WelcomeScreen from "./src/views/WelcomeScreen";
import InitSignUpScreen from "./src/routes/InitSignupScreen";
>>>>>>> Update routing between new welcome page and initial signup
import UserSignUpScreen from './src/views/UserSignUpScreen';

const MainNavigator = createStackNavigator(
    {
<<<<<<< HEAD
        Home: { screen: HomeScreen },
        InitSignup: { screen: InitSignupScreen },
=======
        Welcome: { screen: WelcomeScreen },
        InitSignup: { screen: InitSignUpScreen },
>>>>>>> Update routing between new welcome page and initial signup
        UserSignUp: { screen: UserSignUpScreen },
    },
    {
        headerMode: "none",
        defaultNavigationOptions: {
            cardStyle: {
                backgroundColor: "#f8f8f8"
            },
        },
    }
);

const App = createAppContainer(MainNavigator);

export default App;
