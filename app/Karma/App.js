import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SignUpScreen from './src/views/SignUpScreen';
import WelcomeScreen from './src/views/WelcomeScreen';


const MainNavigator = createStackNavigator({
  Welcome: { screen: WelcomeScreen },
  SignUp: { screen: SignUpScreen },
});

const App = createAppContainer(MainNavigator);

export default App;