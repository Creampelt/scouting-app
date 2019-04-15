import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  Slider,
  TouchableOpacity,
} from "react-native";
import ReactNative from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import CardNonTouchable from "../other/CardNonTouchable.js";
import { SafeAreaView } from "react-navigation";
import { CheckBox } from "react-native-elements";
import * as firebase from "firebase";

const ACCENT_COLOR = "#03b0ff";
const MINUS_ONE_COLOR = "#ff414c";
const PLUS_ONE_COLOR = "#66ff64";
const FONT_MULTIPLIER = (Platform.OS === "ios" ? 1 : 0.9);

const PlusMinusMenu = ({ title, num, isHatch, handlers }) => {
  let displayNum = num;
  let buttons = handlers.map((handler, i) => {
    let stateNum = num;
    if (typeof(num) === "object")
      stateNum = (isHatch ? num[`rocketHatchLevel${3 - i}`] : num[`rocketCargoLevel${3 - i}`]);
    return (
      <View style={{flexDirection: "row", marginBottom: 7}} key={i}>
        <TouchableOpacity
          onPress={() => handler(stateNum, false, isHatch)}
          style={styles.minusOne}>
          <Text style={styles.cardText}>-1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handler(stateNum, true, isHatch)}
          style={styles.plusOne}>
          <Text style={styles.cardText}>+1</Text>
        </TouchableOpacity>
      </View>
  )});

  if (typeof(num) === "object")
    displayNum = Object.values(num).reduce((a, b) => a + b);

  return (
    <View style={{marginBottom: 7}}>
      <Text style={{marginBottom: 5, marginHorizontal: 5}}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardTextSecondary}>   {displayNum}</Text>
      </Text>
      {buttons}
    </View>
  )
};

const OptionsMenu = ({ options, handler }) => options.map((option, index) => (
  <CheckBox
    key={index}
    title={option.title}
    checkedIcon="dot-circle-o"
    uncheckedIcon="circle-o"
    checked={option.checked}
    containerStyle={styles.checkBoxContainer}
    onPress={() => handler(option.goal)}
  />
));

const TimerButton = ({ time, handler }) => {
  let startTime = null;
  return (
    <View style={{marginBottom: 7}}>
      <Text style={{marginBottom: 5, marginHorizontal: 5}}>
        <Text style={styles.cardTitle}>Climb Time</Text>
        <Text style={styles.cardTextSecondary}>   {time}</Text>
      </Text>
      <TouchableOpacity
        onPressIn={() => startTime = new Date()}
        onPressOut={() => handler(startTime)}
        style={styles.timerButton}>
        <Text style={styles.cardText}>Hold to start timing</Text>
      </TouchableOpacity>
    </View>
  )
};

function renderErrorMessage(renderError, team) {
  if (renderError) return <Text style={styles.errorMessage}>Please enter a {(team ? "team" : "match")} number.</Text>;
  return null
}

const PreMatch = ({ changeTeamNumber, startingLevel, startingPosHandler, renderTeamError, renderMatchError,
                    crossedHabLine, crossHabHandler, changeMatchNumber }) => (
  <View>
    <View>
      <Text style={styles.cardTitle}>Match Number:</Text>
      <TextInput multiline={false}
                 keyboardType="numeric"
                 style={styles.textInputSingleLine}
                 placeholder="Match number here"
                 onChange={(text) => changeMatchNumber(text.nativeEvent.text)}
                 editable={true}
      />
      {renderErrorMessage(renderMatchError, false)}
    </View>
    <View>
      <Text style={styles.cardTitle}>Team Number:</Text>
      <TextInput multiline={false}
                 keyboardType="numeric"
                 style={styles.textInputSingleLine}
                 placeholder="Team number here"
                 onChange={(text) => changeTeamNumber(text.nativeEvent.text)}
                 editable={true}
      />
      {renderErrorMessage(renderTeamError, true)}
    </View>
    <View>
      <Text style={styles.cardTitle}>Starting Position</Text>
      <OptionsMenu options={[
        {title: "Level 1", checked: startingLevel === 1, goal: 1},
        {title: "Level 2", checked: startingLevel === 2, goal: 2}
      ]} handler={startingPosHandler} />
    </View>
    <CheckBox title="Crossed hab line:"
              checked={crossedHabLine}
              containerStyle={[styles.checkBoxContainer, {marginLeft: 0, paddingLeft: 0}]}
              textStyle={[styles.cardTitle, {marginLeft: 0, paddingLeft: 0}]}
              iconRight
              onPress={() => crossHabHandler(crossedHabLine)}
    />
  </View>
);

const CargoShip = ({ hatch, cargo, handler }) => (
  <View>
    <PlusMinusMenu title="Hatch" num={hatch} isHatch={true} handlers={handler} />
    <PlusMinusMenu title="Cargo" num={cargo} isHatch={false} handlers={handler} />
  </View>
);

const Rocket = ({ hatch, cargo, handlers }) => (
  <View>
    <PlusMinusMenu title="Hatch" num={hatch} isHatch={true} handlers={handlers} />
    <PlusMinusMenu title="Cargo" num={cargo} isHatch={false} handlers={handlers} />
  </View>
);

const EndGame = ({ level, climbHandler, buddyClimb, buddyClimbHandler, time, timerHandler }) => (
  <View>
    <View>
      <TimerButton time={time} handler={timerHandler} />
      <Text style={styles.cardTitle}>Hab Climb</Text>
      <OptionsMenu options={[
        {title: "None", checked: level === 0, goal: 0},
        {title: "Level 1", checked: level === 1, goal: 1},
        {title: "Level 2", checked: level === 2, goal: 2},
        {title: "Level 3", checked: level === 3, goal: 3},
      ]} handler={climbHandler} />
    </View>
    <View>
      <Text style={styles.cardTitle}>Buddy Climb (Successful)</Text>
      <OptionsMenu options={[
        {title: "None", checked: buddyClimb === 0, goal: 0},
        {title: "1 robot", checked: buddyClimb === 1, goal: 1},
        {title: "2 robots", checked: buddyClimb === 2, goal: 2},
      ]} handler={buddyClimbHandler} />
    </View>
  </View>
);

const PostMatch = ({ brokeDown, brokeDownHandler, changeText, scroll }) => (
  <View>
    <CheckBox title="Robot broke down:"
              checked={brokeDown}
              containerStyle={[styles.checkBoxContainer, {marginLeft: 0, paddingLeft: 0}]}
              textStyle={[styles.cardTitle, {marginLeft: 0, paddingLeft: 0}]}
              iconRight
              onPress={() => brokeDownHandler(brokeDown)}
    />
    <View>
      <Text style={styles.cardTitle}>Comments:</Text>
      <TextInput multiline={true}
                 style={styles.textInputMultiline}
                 placeholder="Enter comments here"
                 onChange={(text) => changeText(text.nativeEvent.text)}
                 onFocus={(event) => scroll(ReactNative.findNodeHandle(event.target))}
                 editable={true}
      />
    </View>
  </View>
);

const Defense = ({ max, min, sliderHandler, checkedHandler, playedDefense, effectiveness }) => (
  <View>
    <CheckBox title="Robot played defense:"
              checked={playedDefense}
              containerStyle={[styles.checkBoxContainer, {marginLeft: 0, paddingLeft: 0}]}
              textStyle={[styles.cardTitle, {marginLeft: 0, paddingLeft: 0}]}
              iconRight
              onPress={() => checkedHandler(playedDefense)}
    />
    <Text style={styles.cardTitle}>Effectiveness of defense:</Text>
    <Slider minimumValue={min}
            maximumValue={max}
            onValueChange={sliderHandler}
            value={effectiveness}
            step={1}
    />
  </View>
);

function removeInstances(str, chars) {
  for (let char in chars) {
    if (chars.hasOwnProperty(char)) {
      str = str.replace(chars[char], "");
    }
  }
  return str;
}

export default class ScoutScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      pregame: {
        matchNumber: null,
        startingLevel: 1,
        teamNumber: null,
        crossedHabLine: false,
      },
      cargoShip: {
        cargoShipHatch: 0,
        cargoShipCargo: 0,
      },
      rocket: {
        hatch: {
          rocketHatchLevel1: 0,
          rocketHatchLevel2: 0,
          rocketHatchLevel3: 0,
        },
        cargo: {
          rocketCargoLevel1: 0,
          rocketCargoLevel2: 0,
          rocketCargoLevel3: 0,
        }
      },
      defense: {
        playedDefense: false,
        defenseEffectiveness: 0,
      },
      endgame: {
        habClimb: 0,
        buddyClimb: 0,
        climbDuration: 0
      },
      postgame: {
        robotBrokeDown: false,
        comments: "",
      },
      renderTeamError: false,
      renderMatchError: false,
      teamNumber: this.props.navigation.getParam("teamNumber", ""),
      event: this.props.navigation.getParam("event", null),
    };
    this.cargoShipHandler = this.cargoShipHandler.bind(this);
    this.rocketLvl1 = this.rocketLvl1.bind(this);
    this.rocketLvl2 = this.rocketLvl2.bind(this);
    this.rocketLvl3 = this.rocketLvl3.bind(this);
    this.startingPosHandler = this.startingPosHandler.bind(this);
    this.crossedHab = this.crossedHab.bind(this);
    this.climbHandler = this.climbHandler.bind(this);
    this.buddyClimbHandler = this.buddyClimbHandler.bind(this);
    this.brokeDownHandler = this.brokeDownHandler.bind(this);
    this.changePostgameText = this.changePostgameText.bind(this);
    this.scrollToInput = this.scrollToInput.bind(this);
    this.changeTeamNumberText = this.changeTeamNumberText.bind(this);
    this.playedDefenseHandler = this.playedDefenseHandler.bind(this);
    this.effectivenessHandler = this.effectivenessHandler.bind(this);
    this.changeMatchNumberText = this.changeMatchNumberText.bind(this);
    this.timerHandler = this.timerHandler.bind(this);
  }

  cargoShipHandler(num, plus, hatch) {
    let stateNum = num;
    if (plus && stateNum < 8) stateNum += 1;
    else if (!plus && stateNum > 0) stateNum -= 1;

    if (hatch) {
      this.setState({
        cargoShip: {
          ...this.state.cargoShip,
          cargoShipHatch: stateNum,
        }
      })
    } else {
      this.setState({
        cargoShip: {
          ...this.state.cargoShip,
          cargoShipCargo: stateNum
        }
      })
    }
  }

  rocketLvl1(num, plus, hatch) {
    let stateNum = num;
    if (plus && stateNum < 4) stateNum += 1;
    else if (!plus && stateNum > 0) stateNum -= 1;

    if (hatch) {
      this.setState({
        rocket: {
          ...this.state.rocket,
          hatch: {
            ...this.state.rocket.hatch,
            rocketHatchLevel1: stateNum
          }
        }
      })
    } else {
      this.setState({
        rocket: {
          ...this.state.rocket,
          cargo: {
            ...this.state.rocket.cargo,
            rocketCargoLevel1: stateNum
          }
        }
      })
    }
  }

  rocketLvl2(num, plus, hatch) {
    let stateNum = num;
    if (plus && stateNum < 4) stateNum += 1;
    else if (!plus && stateNum > 0) stateNum -= 1;

    if (hatch) {
      this.setState({
        rocket: {
          ...this.state.rocket,
          hatch: {
            ...this.state.rocket.hatch,
            rocketHatchLevel2: stateNum
          }
        }
      })
    } else {
      this.setState({
        rocket: {
          ...this.state.rocket,
          cargo: {
            ...this.state.rocket.cargo,
            rocketCargoLevel2: stateNum
          }
        }
      })
    }
  }

  rocketLvl3(num, plus, hatch) {
    let stateNum = num;
    if (plus && stateNum < 4) stateNum += 1;
    else if (!plus && stateNum > 0) stateNum -= 1;

    if (hatch) {
      this.setState({
        rocket: {
          ...this.state.rocket,
          hatch: {
            ...this.state.rocket.hatch,
            rocketHatchLevel3: stateNum
          }
        }
      })
    } else {
      this.setState({
        rocket: {
          ...this.state.rocket,
          cargo: {
            ...this.state.rocket.cargo,
            rocketCargoLevel3: stateNum
          }
        }
      })
    }
  }

  startingPosHandler(goal) {
    this.setState({pregame: {...this.state.pregame, startingLevel: goal}});
  }

  crossedHab(value) {
    this.setState({pregame: {...this.state.pregame, crossedHabLine: !value}})
  }

  climbHandler(goal) {
    this.setState({endgame: {...this.state.endgame, habClimb: goal}});
  }

  buddyClimbHandler(goal) {
    this.setState({endgame: {...this.state.endgame, buddyClimb: goal}});
  }

  brokeDownHandler(value) {
    this.setState({postgame: {...this.state.postgame, robotBrokeDown: !value}});
  }

  changePostgameText(text) {
    this.setState({postgame: {...this.state.postgame, comments: text}});
  }

  scrollToInput (reactNode) {
    this.scroll.props.scrollToFocusedInput(reactNode)
  }

  changeTeamNumberText(text) {
    this.setState({pregame: {...this.state.pregame, teamNumber: text}});
  }

  changeMatchNumberText(text) {
    this.setState({pregame: {...this.state.pregame, matchNumber: text}});
  }

  playedDefenseHandler(value) {
    this.setState({
      defense: {
        ...this.state.defense,
        playedDefense: !value,
        defenseEffectiveness: 0,
      }
    });
  }

  effectivenessHandler(value) {
    this.setState({
      defense: {
        ...this.state.defense,
        playedDefense: true,
        defenseEffectiveness: value
      }
    });
  }

  timerHandler(startTime) {
    let endTime = new Date();
    let duration = Math.round((endTime - startTime) / 1000);
    this.setState({endgame: {...this.state.endgame, climbDuration: duration}})
  }

  submitForm(rawData, handler) {
    let data = {};
    let teamNumber = rawData.pregame.teamNumber;
    let exclude = ["renderTeamError", "renderMatchError", "teamNumber", "event"];
    let error = false;

    if (rawData.pregame.teamNumber === null) {
      this.setState({renderTeamError: true});
      error = true;
    }

    if (rawData.pregame.matchNumber === null) {
      this.setState({renderMatchError: true});
      error = true;
    }

    if (error) return;

    for (let section in rawData) {
      if (rawData.hasOwnProperty(section) && !exclude.includes(section))
        data[section] = rawData[section];
    }

    let url = this.state.teamNumber + "/" + this.state.event.name + "/matchData/" + teamNumber + "/" + this.state.pregame.matchNumber;
    firebase.database().ref(url).set(data);
    this.setState({renderError: false});
    handler();
  }

  render() {
    const screenWidth = Dimensions.get("window").width;
    const keyboardDismissMode = Platform.OS === "ios" ? "interactive" : "on-drag";
    const ellipsizeMode = "tail";

    return (
      <SafeAreaView style={{flex: 1}} forceInset={{bottom: "never"}}>
        <View
          style={[styles.header, { width: screenWidth, padding: screenWidth * 0.02, paddingHorizontal: 25 }]}>
          <Text style={styles.title}>Scout a Match</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.pop()}
            style={styles.cancelButton}>
            <Text numberOfLines={1} style={styles.cancelButtonText} ellipsizeMode={ellipsizeMode}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.submitForm(this.state, () => this.props.navigation.pop());
            }}
            style={styles.submitButton}>
            <Text numberOfLines={1} style={styles.submitButtonText} ellipsizeMode={ellipsizeMode}>Submit</Text>
          </TouchableOpacity>
        </View>
        <KeyboardAwareFlatList
          innerRef={ref => {this.scroll = ref}}
          enableOnAndroid={true}
          enableResetScrollToCoords={false}
          extraHeight={150}
          style={styles.container}
          keyboardDismissMode={keyboardDismissMode}
          keyboardShouldPersistTaps="always"
          data={[
            {key: "Pre-Match/Sandstorm", content: (<PreMatch startingLevel={this.state.pregame.startingLevel}
                                                             startingPosHandler={this.startingPosHandler}
                                                             renderMatchError={this.state.renderMatchError}
                                                             renderTeamError={this.state.renderTeamError}
                                                             crossedHabLine={this.state.pregame.crossedHabLine}
                                                             crossHabHandler={this.crossedHab}
                                                             changeMatchNumber={this.changeMatchNumberText}
                                                             changeTeamNumber={this.changeTeamNumberText} />)
            },
            {key: "Cargo Ship", content: (<CargoShip hatch={this.state.cargoShip.cargoShipHatch}
                                                    cargo={this.state.cargoShip.cargoShipCargo}
                                                    handler={[this.cargoShipHandler]} />)
            },
            {key: "Rocket", content: (<Rocket hatch={this.state.rocket.hatch}
                                              cargo={this.state.rocket.cargo}
                                              handlers={[this.rocketLvl3, this.rocketLvl2, this.rocketLvl1]} />)
            },
            {key: "Defense", content: (<Defense checkedHandler={this.playedDefenseHandler}
                                                sliderHandler={this.effectivenessHandler}
                                                playedDefense={this.state.defense.playedDefense}
                                                effectiveness={this.state.defense.defenseEffectiveness}
                                                min={0}
                                                max={10} />)},
            {key: "End Game", content: (<EndGame level={this.state.endgame.habClimb}
                                                 climbHandler={this.climbHandler}
                                                 time={this.state.endgame.climbDuration}
                                                 timerHandler={this.timerHandler}
                                                 buddyClimb={this.state.endgame.buddyClimb}
                                                 buddyClimbHandler={this.buddyClimbHandler} />)
            },
            {key: "Post Match", content: (<PostMatch brokeDown={this.state.postgame.robotBrokeDown}
                                                     brokeDownHandler={this.brokeDownHandler}
                                                     scroll={this.scrollToInput}
                                                     changeText={this.changePostgameText} />)
            }
          ]}
          renderItem={({item}) => <CardNonTouchable title={item.key} content={item.content} style={item.style} handler={item.handler}/>}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  header: {
    zIndex: 999,
    backgroundColor: "#fff",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    alignItems: "center",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 20 * FONT_MULTIPLIER,
    marginRight: "auto",
  },
  cancelButton: {
    backgroundColor: "transparent",
    flex: -1,
    padding: 10,
    paddingHorizontal: 15,
    marginLeft: 3
  },
  cancelButtonText: {
    fontFamily: "open-sans",
    color: "#a8a8a8",
    fontSize: 20 * FONT_MULTIPLIER,
  },
  submitButton: {
    backgroundColor: ACCENT_COLOR,
    flex: -1,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  submitButtonText: {
    fontFamily: "open-sans-bold",
    color: "#fff",
    fontSize: 20 * FONT_MULTIPLIER,
  },
  cardTitle: {
    fontFamily: "open-sans-bold",
    fontSize: 16 * FONT_MULTIPLIER,
    marginLeft: 5,
    color: "#000",
  },
  cardText: {
    fontFamily: "open-sans-bold",
    fontSize: 16 * FONT_MULTIPLIER,
    color: "#fff",
  },
  cardTextSecondary: {
    fontFamily: "open-sans",
    fontSize: 15 * FONT_MULTIPLIER,
    color: "#a8a8a8",
    marginLeft: 5
  },
  minusOne: {
    flex: 1,
    backgroundColor: MINUS_ONE_COLOR,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5
  },
  plusOne: {
    flex: 1,
    backgroundColor: PLUS_ONE_COLOR,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  checkBoxContainer: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    margin: 0,
    padding: 5,
  },
  textInputSingleLine: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    fontFamily: "open-sans",
    fontSize: 14 * FONT_MULTIPLIER,
    margin: 5,
  },
  textInputMultiline: {
    minHeight: 75,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    fontFamily: "open-sans",
    fontSize: 14 * FONT_MULTIPLIER,
    margin: 5,
  },
  errorMessage: {
    fontFamily: "open-sans",
    fontSize: 16 * FONT_MULTIPLIER,
    color: MINUS_ONE_COLOR,
    margin: 5,
  },
  timerButton: {
    flex: 1,
    backgroundColor: ACCENT_COLOR,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5
  }
});