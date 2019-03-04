import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from "react-native";
import ReactNative from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import Touchable from "react-native-platform-touchable";
import CardNonTouchable from "../other/CardNonTouchable.js";
import {SafeAreaView} from "react-navigation";
import { CheckBox } from 'react-native-elements';

const ACCENT_COLOR = '#03b0ff';
const ACCENT_COLOR_DARK = '#0374b2';
const MINUS_ONE_COLOR = '#ff414c';
const MINUS_ONE_COLOR_DARK = '#b02e36';
const PLUS_ONE_COLOR = '#66ff64';
const PLUS_ONE_COLOR_DARK= '#4ca84a';

const PlusMinusMenu = ({ title, num, isHatch, handler }) => (
  <View style={{marginBottom: 7}}>
    <Text style={{marginBottom: 5, marginHorizontal: 5}}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardTextSecondary}>   {num}</Text>
    </Text>
    <View style={{flexDirection: 'row'}}>
      <Touchable
        background={Touchable.Ripple(MINUS_ONE_COLOR_DARK, false)}
        onPress={() => handler(num, false, isHatch)}
        style={styles.minusOne}>
        <Text style={styles.cardText}>-1</Text>
      </Touchable>
      <Touchable
        background={Touchable.Ripple(PLUS_ONE_COLOR_DARK, false)}
        onPress={() => handler(num, true, isHatch)}
        style={styles.plusOne}>
        <Text style={styles.cardText}>+1</Text>
      </Touchable>
    </View>
  </View>
);

const OptionsMenu = ({ options, handler }) => options.map((option, index) => (
  <CheckBox
    key={index}
    title={option.title}
    checkedIcon='dot-circle-o'
    uncheckedIcon='circle-o'
    checked={option.checked}
    containerStyle={styles.checkBoxContainer}
    onPress={() => handler(option.goal)}
  />
));

const Sandstorm = ({ hatch, cargo, handler, onSecondLevel, startingPosHandler, crossedHabLine, crossHabHandler }) => (
  <View>
    <View>
      <Text style={styles.cardTitle}>Starting Position</Text>
      <OptionsMenu options={[
        {title: 'Level 1', checked: !onSecondLevel, goal: false},
        {title: 'Level 2', checked: onSecondLevel, goal: true}
      ]} handler={startingPosHandler} />
    </View>
    <CheckBox title='Crossed hab line:'
              checked={crossedHabLine}
              containerStyle={[styles.checkBoxContainer, {marginLeft: 0, paddingLeft: 0}]}
              textStyle={[styles.cardTitle, {marginLeft: 0, paddingLeft: 0}]}
              iconRight
              onPress={() => crossHabHandler(crossedHabLine)}
    />
    <PlusMinusMenu title="Hatch" num={hatch} isHatch={true} handler={handler} />
    <PlusMinusMenu title="Cargo" num={cargo} isHatch={false} handler={handler} />
  </View>
);

const Teleop = ({ hatch, cargo, handler }) => (
  <View>
    <PlusMinusMenu title="Hatch" num={hatch} isHatch={true} handler={handler} />
    <PlusMinusMenu title="Cargo" num={cargo} isHatch={false} handler={handler} />
  </View>
);

const EndGame = ({ level, climbHandler, buddyClimb, buddyClimbHandler  }) => (
  <View>
    <View>
      <Text style={styles.cardTitle}>Hab Climb</Text>
      <OptionsMenu options={[
        {title: 'None', checked: level === 0, goal: 0},
        {title: 'Level 1', checked: level === 1, goal: 1},
        {title: 'Level 2', checked: level === 2, goal: 2},
        {title: 'Level 3', checked: level === 3, goal: 3},
      ]} handler={climbHandler} />
    </View>
    <View>
      <Text style={styles.cardTitle}>Buddy Climb (Successful)</Text>
      <OptionsMenu options={[
        {title: 'None', checked: buddyClimb === 0, goal: 0},
        {title: '1 robot', checked: buddyClimb === 1, goal: 1},
        {title: '2 robots', checked: buddyClimb === 2, goal: 2},
      ]} handler={buddyClimbHandler} />
    </View>
  </View>
);

const PostMatch = ({ brokeDown, brokeDownHandler, changeText, scroll }) => (
  <View>
    <CheckBox title='Robot broke down:'
              checked={brokeDown}
              containerStyle={[styles.checkBoxContainer, {marginLeft: 0, paddingLeft: 0}]}
              textStyle={[styles.cardTitle, {marginLeft: 0, paddingLeft: 0}]}
              iconRight
              onPress={() => brokeDownHandler(brokeDown)}
    />
    <View>
      <Text style={styles.cardTitle}>Comments:</Text>
      <TextInput multiline={true}
                 style={styles.textInput}
                 placeholder='Enter comments here'
                 onEndEditing={(text) => changeText(text.nativeEvent.text)}
                 onFocus={(event) => scroll(ReactNative.findNodeHandle(event.target))}
                 editable={true}
      />
    </View>
  </View>
);

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      sandstorm: {
        hatch: 0,
        cargo: 0,
        onSecondLevel: false,
        crossedHabLine: false,
      },
      teleop: {
        hatch: 0,
        cargo: 0,
      },
      endgame: {
        climb: 0,
        buddyClimb: 0,
      },
      postgame: {
        brokeDown: false,
        comments: '',
      }
    };
    this.sandstormHandler = this.sandstormHandler.bind(this);
    this.teleopHandler = this.teleopHandler.bind(this);
    this.startingPosHandler = this.startingPosHandler.bind(this);
    this.crossedHab = this.crossedHab.bind(this);
    this.climbHandler = this.climbHandler.bind(this);
    this.buddyClimbHandler = this.buddyClimbHandler.bind(this);
    this.brokeDownHandler = this.brokeDownHandler.bind(this);
    this.changeText = this.changeText.bind(this);
    this.scrollToInput = this.scrollToInput.bind(this);
  }

  sandstormHandler(num, plus, hatch) {
    let stateNum = num;
    if (plus) stateNum += 1;
    else if (stateNum > 0) stateNum -= 1;
    else stateNum = 0;

    if (hatch) {
      this.setState({
        sandstorm: {
          ...this.state.sandstorm,
          hatch: stateNum,
        }
      })
    } else {
      this.setState({
        sandstorm: {
          ...this.state.sandstorm,
          cargo: stateNum
        }
      })
    }
  }

  teleopHandler(num, plus, hatch) {
    let stateNum = num;
    if (plus) stateNum += 1;
    else if (stateNum > 0) stateNum -= 1;
    else stateNum = 0;

    if (hatch) {
      this.setState({
        teleop: {
          ...this.state.teleop,
          hatch: stateNum,
        }
      })
    } else {
      this.setState({
        teleop: {
          ...this.state.teleop,
          cargo: stateNum
        }
      })
    }
  }

  startingPosHandler(goal) {
    this.setState({sandstorm: {...this.state.sandstorm, onSecondLevel: goal}});
  }

  crossedHab(value) {
    this.setState({sandstorm: {...this.state.sandstorm, crossedHabLine: !value}})
  }

  climbHandler(goal) {
    console.log(goal);
    this.setState({endgame: {...this.state.endgame, climb: goal}});
  }

  buddyClimbHandler(goal) {
    this.setState({endgame: {...this.state.endgame, buddyClimb: goal}});
  }

  brokeDownHandler(value) {
    this.setState({postgame: {...this.state.postgame, brokeDown: !value}});
  }

  changeText(text) {
    console.log(text);
    this.setState({postgame: {...this.state.postgame, comments: text}});
  }

  scrollToInput (reactNode) {
    this.scroll.props.scrollToFocusedInput(reactNode)
  }

  render() {
    const screenWidth = Dimensions.get('window').width;
    const {navigate} = this.props.navigation;
    let keyboardDismissMode;
    if (Platform.OS === 'ios') keyboardDismissMode = 'interactive';
    else keyboardDismissMode = 'on-drag';
    return (
      <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'never'}}>
        <View
          style={[styles.header, { width: screenWidth, padding: screenWidth * 0.02, paddingHorizontal: 25 }]}>
          <Text style={styles.title}>Scout a Match</Text>
          <Touchable
            background={Touchable.Ripple('#f0f0f0', false)}
            onPress={() => navigate('Home')}
            style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Touchable>
          <Touchable
            background={Touchable.Ripple(ACCENT_COLOR_DARK, false)}
            onPress={() => navigate('Home')}
            style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </Touchable>
        </View>
        <KeyboardAwareFlatList
          innerRef={ref => {this.scroll = ref}}
          enableOnAndroid={true}
          enableResetScrollToCoords={false}
          extraHeight={150}
          style={styles.container}
          keyboardDismissMode={keyboardDismissMode}
          data={[
            {key: 'Sandstorm', content: (<Sandstorm hatch={this.state.sandstorm.hatch}
                                                    cargo={this.state.sandstorm.cargo}
                                                    handler={this.sandstormHandler}
                                                    onSecondLevel={this.state.sandstorm.onSecondLevel}
                                                    crossedHabLine={this.state.sandstorm.crossedHabLine}
                                                    startingPosHandler={this.startingPosHandler}
                                                    crossHabHandler={this.crossedHab} />)
            },
            {key: 'Teleop', content: (<Teleop hatch={this.state.teleop.hatch}
                                              cargo={this.state.teleop.cargo}
                                              handler={this.teleopHandler} />)
            },
            {key: 'End Game', content: (<EndGame level={this.state.endgame.climb}
                                                 climbHandler={this.climbHandler}
                                                 buddyClimb={this.state.endgame.buddyClimb}
                                                 buddyClimbHandler={this.buddyClimbHandler} />)
            },
            {key: 'Post Match', content: (<PostMatch brokeDown={this.state.postgame.brokeDown}
                                                     brokeDownHandler={this.brokeDownHandler}
                                                     scroll={this.scrollToInput}
                                                     changeText={this.changeText} />)
            },
            {key: '', content: (<View />), style: {opacity: 0}}
          ]}
          renderItem={({item}) => <CardNonTouchable title={item.key} content={item.content} style={item.style} handler={item.handler}/>}
        />
      </SafeAreaView>
    )
  }
}

// TODO: Add box shadow for android (shadow props only support iOS)
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    zIndex: 999,
    backgroundColor: '#fff',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    marginRight: 'auto',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    flex: -1,
    padding: 10,
    paddingHorizontal: 15,
    marginLeft: 3
  },
  cancelButtonText: {
    fontFamily: 'open-sans',
    color: '#a8a8a8',
    fontSize: 20,
  },
  submitButton: {
    backgroundColor: ACCENT_COLOR,
    flex: -1,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  submitButtonText: {
    fontFamily: 'open-sans-bold',
    color: '#fff',
    fontSize: 20,
  },
  cardTitle: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    marginLeft: 5,
    color: '#000',
  },
  cardText: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    color: '#fff',
  },
  cardTextSecondary: {
    fontFamily: 'open-sans',
    fontSize: 15,
    color: '#a8a8a8',
    marginLeft: 5
  },
  minusOne: {
    flex: 1,
    backgroundColor: MINUS_ONE_COLOR,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5
  },
  plusOne: {
    flex: 1,
    backgroundColor: PLUS_ONE_COLOR,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  checkBoxContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    margin: 0,
    padding: 5,
  },
  textInput: {
    minHeight: 75,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'open-sans',
    fontSize: 14,
    margin: 5,
  }
});