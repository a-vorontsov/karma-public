import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import WelcomeScreen from "./src/views/WelcomeScreen";
import SignUpScreen from './src/views/SignUpScreen';
import TermsScreen from './src/views/TermsScreen';
import PrivacyScreen from './src/views/PrivacyScreen';

const MainNavigator = createStackNavigator({
  Welcome: {screen: WelcomeScreen},
  SignUp: {screen: SignUpScreen},
  Terms: {screen: TermsScreen},
  Privacy: {screen: PrivacyScreen},
});

const App = createAppContainer(MainNavigator);

export default App;
