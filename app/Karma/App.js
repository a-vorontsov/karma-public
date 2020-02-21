import {createSwitchNavigator,createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import WelcomeScreen from "./src/views/WelcomeScreen";
import InitSignUpScreen from "./src/routes/InitSignupScreen";
import UserSignUpScreen from "./src/views/UserSignUpScreen";
import OrgSignUpScreen from "./src/views/OrgSignUpScreen";
import AboutScreen from './src/views/AboutScreen';
import ContactInfoScreen from './src/views/ContactInfoScreen';
import PrivacyScreen from './src/views/PrivacyScreen';
import TermsScreen from './src/views/TermsScreen';
import SettingsMenuScreen from './src/views/SettingsMenuScreen';
import MainTabNavigator from './MainTabNavigator'

const MainNavigator = createStackNavigator(
    {
        Welcome: {screen: WelcomeScreen},
        InitSignup: {screen: InitSignUpScreen},
        UserSignUp: {screen: UserSignUpScreen},
        OrgSignUp: {screen: OrgSignUpScreen},
        About: {screen: AboutScreen},
        ContactInfo: {screen: ContactInfoScreen},
        Tab: MainTabNavigator,
        Privacy: {screen: PrivacyScreen},
        Terms: {screen: TermsScreen},
        SettingsMenu: {screen: SettingsMenuScreen}
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


//  Hide Tabs when on any screen on MainNavigator except for SelectScreen
MainNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    // if (navigation.state.index > 0) {
    // //   tabBarVisible = false;
    // }
  
    return {
      tabBarVisible,
    };
  };

const AppNavigator = createSwitchNavigator({
        Splash: {
            getScreen: () => require('./src/views/WelcomeScreen').default,
        },
        Auth: MainNavigator,
        Main: MainTabNavigator,
    }, 
    {
        initialRouteName: 'Splash',
    },
);

const App = createAppContainer(AppNavigator);

export default App;
