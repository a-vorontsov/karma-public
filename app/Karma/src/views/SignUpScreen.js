import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import CheckBox from '../components/CheckBox';
import {ScrollView} from 'react-native-gesture-handler';
import TextInput from '../components/TextInput';
import {hasNotch} from 'react-native-device-info';

const linkColour = '#3bbfb2';
const {width, height} = Dimensions.get('window');
const formWidth = 0.8 * width;
const textColour = '#7F7F7F';
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

class SignUpScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      email: 'team-team@gmail.com',
      username: '',
      password: '',
      confPassword: '',
      hidePassword: true,
      termsChecked: false,
      toolTipVisible: true,
      firstOpen: true,
    };
    this.onChangeText = this.onChangeText.bind(this);
  }

  onChangeText = event => {
    const {name, text} = event;
    this.setState({[name]: text});
  };

  isValidPassword = () => {
    return PASSWORD_REGEX.test(this.state.password);
  };

  signUserUp = () => {
    const {fname, lname, email, username, password, confPassword} = this.state;
    this.setState({firstOpen: false});
  };

  render() {
    const showPasswordError =
      !this.state.password ||
      this.state.password !== this.state.confPassword ||
      !this.isValidPassword();
    const {navigate} = this.props.navigation;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{minHeight: height}}>
            <View style={{alignItems: 'center'}}>
              {/** Header **/}
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  marginTop: hasNotch() ? 60 : StatusBar.currentHeight,
                  alignItems: 'flex-start',
                  width: formWidth,
                }}>
                <View style={styles.header}>
                  <TouchableOpacity>
                    <Text style={{color: linkColour, fontSize: 30}}>←</Text>
                  </TouchableOpacity>
                  <Text style={styles.headerText}>Sign Up</Text>
                </View>
                <Text style={styles.subheaderText}>Create a new account</Text>
              </View>
            </View>

            {/** form content **/}
            <View
              style={{
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flex: 3,
                width: width,
              }}>
              <TextInput
                style={styles.textInput}
                placeholder="First Name"
                name="fname"
                onChange={this.onChangeText}
                onSubmitEditing={() => this.lname.focus()}
                showError={this.state.firstOpen ? false : !this.state.fname}
              />

              <TextInput
                inputRef={ref => (this.lname = ref)}
                placeholder="Last Name"
                name="lname"
                onChange={this.onChangeText}
                onSubmitEditing={() => this.username.focus()}
                showError={this.state.firstOpen ? false : !this.state.lname}
              />

              <View style={{flexDirection: 'row'}}>
                <TextInput
                  placeholder={this.state.email}
                  autoCapitalize="none"
                  name="email"
                  onChange={this.onChangeText}
                  showError={false}
                  editable={false}
                />
                <Text style={{position: 'absolute', top: 15, right: 10}}>
                  ✔️
                </Text>
              </View>

              <TextInput
                inputRef={ref => (this.username = ref)}
                placeholder="Choose a username"
                autoCapitalize="none"
                onChange={this.onChangeText}
                name="username"
                onSubmitEditing={() => this.password.focus()}
                showError={this.state.firstOpen ? false : !this.state.username}
              />
              {/**
               *  -- Password fields --
               */}
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  placeholder="Password"
                  autoCapitalize="none"
                  name="password"
                  secureTextEntry={this.state.hidePassword}
                  blurOnSubmit={false}
                  onChange={this.onChangeText}
                  showError={
                    this.state.firstOpen ? false : !this.state.password
                  }
                  incorrectPassword={
                    this.state.firstOpen ? false : showPasswordError
                  }
                  inputRef={ref => (this.password = ref)}
                  onSubmitEditing={() => this.confPassword.focus()}
                  returnKeyType="next"
                />
                <TouchableOpacity
                  onPress={() =>
                    this.setState({hidePassword: !this.state.hidePassword})
                  }
                  style={{position: 'absolute', top: 15, right: 0}}>
                  <Text style={{color: linkColour}}>Show</Text>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm Password"
                  name="confPassword"
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  inputRef={ref => (this.confPassword = ref)}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  secureTextEntry={this.state.hidePassword}
                  returnKeyType="default"
                  onChange={this.onChangeText}
                  showError={this.state.firstOpen ? false : showPasswordError}
                  errorText={showPasswordError ? 'Passwords must match' : null}
                />
                <TouchableOpacity
                  onPress={() =>
                    this.setState({hidePassword: !this.state.hidePassword})
                  }
                  style={{position: 'absolute', top: 15, right: 0}}>
                  <Text style={{color: linkColour}}>Show</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/**
             * -- Footer --
             * **/}
            <View
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <View style={styles.footer}>
                <View style={{flexDirection: 'row', paddingBottom: 10}}>
                  <CheckBox
                    style={styles.checkBox}
                    onPressIn={() =>
                      this.setState({termsChecked: !this.state.termsChecked})
                    }
                  />
                  <Text style={{flexShrink: 1, color: textColour}}>
                    <Text>
                      By creating an account, you agree to all the legal stuff:{' '}
                    </Text>
                    <Text
                      style={{
                        color: linkColour,
                        textDecorationLine: 'underline',
                      }}
                      onPress={() => navigate('Terms')}>
                      Terms of Use
                    </Text>
                    <Text> {'&'} </Text>
                    <Text
                      style={{
                        color: linkColour,
                        textDecorationLine: 'underline',
                      }}
                      onPress={() => navigate('Privacy')}>
                      Privacy
                    </Text>
                  </Text>
                </View>
                {!this.state.firstOpen && !this.state.termsChecked ? (
                  <Text style={{color: '#e81f10'}}>
                    You must agree to the terms and conditions
                  </Text>
                ) : null}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={this.signUserUp}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'black',
    paddingLeft: 10,
  },
  subheaderText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    textAlignVertical: 'top',
    textAlign: 'left',
    paddingTop: 20,
    paddingBottom: 25,
    color: '#3bbfb2',
  },
  checkBox: {
    paddingRight: 20,
  },

  container: {
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    width: formWidth,
    height: 45,
    borderColor: 'transparent',
    borderBottomColor: '#D3D3D3',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 20,
    fontSize: 20,
    lineHeight: 20,
    color: '#7F7F7F',
    fontFamily: 'Arial',
  },
  footer: {
    width: formWidth,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },

  submitButton: {
    backgroundColor: '#3bbfb2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginTop: 15,
    borderRadius: 30,
    width: formWidth,
  },
});

export default SignUpScreen;
