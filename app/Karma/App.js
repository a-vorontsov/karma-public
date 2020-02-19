import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import {createBottomTabNavigator} from 'react-navigation-tabs';
import WelcomeScreen from "./src/views/WelcomeScreen";
import InitSignUpScreen from "./src/routes/InitSignupScreen";
import UserSignUpScreen from "./src/views/UserSignUpScreen";
import OrgSignUpScreen from "./src/views/OrgSignUpScreen";
import AboutScreen from './src/views/AboutScreen';
import ContactInfoScreen from './src/views/ContactInfoScreen';
import PrivacyScreen from './src/views/PrivacyScreen';
import TermsScreen from './src/views/TermsScreen';
import ActivitiesScreen from './src/views/ActivitiesScreen';
import CausesScreen from './src/views/CausesScreen';
import NotificationsScreen from './src/views/NotificationsScreen';
import ProfileScreen from './src/views/ProfileScreen';

const MainNavigator = createStackNavigator(
    {
        Welcome: {screen: WelcomeScreen},
        InitSignup: {screen: InitSignUpScreen},
        UserSignUp: {screen: UserSignUpScreen},
        OrgSignUp: {screen: OrgSignUpScreen},
        About: {screen: AboutScreen},
        Privacy: {screen: PrivacyScreen},
        Terms: {screen: TermsScreen},
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
    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }
  
    return {
      tabBarVisible,
    };
  };
  
  export const ActivitiesNavigator = createStackNavigator(
    {
      ActivitiesScreen
    },
    {
      initialRouteName: 'ActivitiesScreen',
    },
  );
  
  export const CausesNavigator = createStackNavigator(
    {
      CausesScreen
    },
    {
      initialRouteName: 'CausesScreen',
    },
  );
  
  export const NotificationsNavigator = createStackNavigator(
    {
      NotificationsScreen
    },
    {
      initialRouteName: 'NotificationsScreen',
    },
  );
  
  export const ProfileNavigator = createStackNavigator(
    {
      ProfileScreen
    },
    {
      initialRouteName: 'ProfileScreen',
    },
  );
  
  ActivitiesNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 1) {
      tabBarVisible = false;
    }
    return {
      tabBarVisible,
    };
  };
  
  CausesNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }
    return {
      tabBarVisible,
    };
  };
  
  NotificationsNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }
    return {
      tabBarVisible,
    };
  };
  
  ProfileNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }
    return {
      tabBarVisible,
    };
  };
  
  export const MainTabNavigator = createBottomTabNavigator(
    {
      Activities: {
        screen: ActivitiesNavigator,
        navigationOptions: {
          tabBarLabel: 'Activities',
          tabBarIcon: ({ focused }) =>  (
              focused
              ? <Image source={require('./src/assets/images/nav-bar/activities-on.png')} size={25}  />
              : <Image source={require('./src/assets/images/nav-bar/activities-off.png')} size={25}  /> 
           )
        },
      },
      Causes: {
        screen: CausesNavigator,
        navigationOptions: {
          tabBarLabel: 'Causes',
          tabBarIcon: ({ focused }) =>  (
              focused
              ? <Image source={require('./src/assets/images/nav-bar/causes-on.png')} size={25}  />
              : <Image source={require('./src/assets/images/nav-bar/causes-off.png')} size={25}  /> 
           )
        },
      },
      Notifications: {
        screen: NotificationsNavigator,
        navigationOptions: {
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ focused }) =>  (
              focused
              ? <Image source={require('./src/assets/images/nav-bar/notifications-on.png')} size={25}  />
              : <Image source={require('./src/assets/images/nav-bar/notifications-off.png')} size={25}  /> 
           )
        },
      },
      Profile: {
        screen: ProfileNavigator,
        navigationOptions: {
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) =>  (
              focused
              ? <Image source={require('./src/assets/images/nav-bar/profile-on.png')} size={25}  />
              : <Image source={require('./src/assets/images/nav-bar/profile-off.png')} size={25}  /> 
           )
        },
      },
    },
    {
      tabBarOptions: {
        showLabel: true,
        labelStyle: {
          fontFamily: 'Circular-Std-Bold',
        },
        style: {
          backgroundColor: '#1D1D1D',
        },
      },
    },
  );

const App = createAppContainer(MainNavigator);

export default App;
