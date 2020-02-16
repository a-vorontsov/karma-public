import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SignUpScreen from './src/views/SignUpScreen';
import WelcomeScreen from './src/views/WelcomeScreen';
import AboutScreen from './src/views/AboutScreen';

const MainNavigator = createStackNavigator({
  About: {screen: AboutScreen},
  Welcome: { screen: WelcomeScreen },
  SignUp: { screen: SignUpScreen },
});

const App = createAppContainer(MainNavigator);

export default App;