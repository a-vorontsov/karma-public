import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from "./src/routes/HomeScreen";
import InitSignupScreen from "./src/routes/InitSignupScreen";
import UserSignUpScreen from './src/views/UserSignUpScreen';

const MainNavigator = createStackNavigator(
    {
        Home: { screen: HomeScreen },
        InitSignup: { screen: InitSignupScreen },
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
