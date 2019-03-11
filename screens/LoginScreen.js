import React from 'react';
import {
  AsyncStorage,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Touchable from 'react-native-platform-touchable';
import {NavigationActions, SafeAreaView, StackActions} from 'react-navigation';

const ACCENT_COLOR = '#03b0ff';
const ACCENT_COLOR_DARK = '#0374b2';

function renderErrorMessage(renderError) {
  if (renderError) return <Text style={styles.errorMessage}>Please enter a valid team number.</Text>;
  return null
}

const resetAction = (teamNumber) => StackActions.reset({
  index: 0, // <-- current active route from actions array
  actions: [
    NavigationActions.navigate({routeName: 'Home', params: {teamNumber: teamNumber}}),
  ],
});

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderError: false,
      teamNumber: null,
    };
    this.logIn = this.logIn.bind(this);
    this.setState = this.setState.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  logIn(teamNumber, dispatch, resetAction) {
    let teamNum = parseInt(teamNumber, 10);
    if (isNaN(teamNum)) this.setState({renderError: true});
    else {
      this._storeData(teamNumber);
      dispatch(resetAction);
    }
  }

  editInput(text) {
    this.setState({teamNumber: text});
    this.setState({renderError: false});
  }

  _storeData = async (data) => {
    try {
      await AsyncStorage.setItem('teamNumber', data);
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async () => {
    try {
      return await AsyncStorage.getItem('teamNumber');
    } catch (error) {
      // Error retrieving data
    }
  };

  componentDidMount() {
    let setState = this.setState;
    let dispatch = this.props.navigation.dispatch;
    this._retrieveData().then(function(teamNumber) {
      if (teamNumber !== null) {
        setState({teamNumber: teamNumber});
        dispatch(resetAction(teamNumber));
      }
    });
  }

  render() {
    const screenWidth = Dimensions.get('window').width;

    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Text style={styles.title}>Scouting App</Text>
            <Text style={styles.subtitle}>created by Team 6418</Text>
            <TextInput style={[styles.textInput, {width: screenWidth - 2 * styles.container.padding}]}
                       keyboardType="numeric"
                       onChange={(text) => this.editInput(text.nativeEvent.text)}
                       placeholder="Team number" />
            {renderErrorMessage(this.state.renderError)}
            <Touchable
              background={Touchable.Ripple(ACCENT_COLOR_DARK, true)}
              onPress={() => this.logIn(this.state.teamNumber, this.props.navigation.dispatch, resetAction(this.state.teamNumber))}
              style={[styles.loginButton, {width: screenWidth - 2 * styles.container.padding}]}>
              <Text style={styles.loginButtonText}>Log in</Text>
            </Touchable>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'open-sans',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#a0a0a0'
  },
  textInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'open-sans',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: ACCENT_COLOR,
    width: 100,
    height: 65,
    borderRadius: 75 / 2,
    alignContent: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontFamily: 'open-sans-extra-bold',
  },
  errorMessage: {
    fontFamily: 'open-sans',
    fontSize: 16,
    color: '#ff414c',
    margin: 5,
  }
});