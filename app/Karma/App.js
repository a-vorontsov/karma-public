import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SignUpScreen from './src/views/SignUpScreen';
import WelcomeScreen from './src/views/WelcomeScreen';
import AboutScreen from './src/views/AboutScreen';
import ContactInfoScreen from './src/views/ContactInfoScreen';

const MainNavigator = createStackNavigator({
    About: {screen: AboutScreen},
    ContactInfo: {screen: ContactInfoScreen},
    Welcome: { screen: WelcomeScreen },
    SignUp: { screen: SignUpScreen },
});

const App = createAppContainer(MainNavigator);

export default App;