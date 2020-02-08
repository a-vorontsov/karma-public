import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import SignUpScreen from './src/views/SignUpScreen';

const MainNavigator = createStackNavigator({
  SignUp: {screen: SignUpScreen},
});

const App = createAppContainer(MainNavigator);

export default App;