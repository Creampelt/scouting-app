import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Touchable from "react-native-platform-touchable";
import CardNonTouchable from "../other/CardNonTouchable.js";
import {SafeAreaView} from "react-navigation";
import CheckBox from 'react-native-elements';

const ACCENT_COLOR = '#03b0ff';
const ACCENT_COLOR_DARK = '#0374b2';
const MINUS_ONE_COLOR = '#ff414c';
const MINUS_ONE_COLOR_DARK = '#b02e36';
const PLUS_ONE_COLOR = '#66ff64';
const PLUS_ONE_COLOR_DARK= '#4ca84a';

const PlusMinusMenu = ({ title, num, isHatch, handler }) => (
  <View style={{marginBottom: 7}}>
    <Text style={{marginBottom: 5}}>
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
      },
      teleop: {
        hatch: 0,
        cargo: 0,
      }
    };
    this.sandstormHandler = this.sandstormHandler.bind(this);
  }

  sandstormHandler(num, plus, hatch) {
    let stateNum = num;
    if (plus) stateNum += 1;
    else if (stateNum > 0) stateNum -= 1;
    else stateNum = 0;

    console.log(this.state.sandstorm.cargo);

    if (hatch) {
      this.setState(prevState => ({
        sandstorm: {
          hatch: stateNum,
          cargo: prevState.sandstorm.cargo
        }
      }))
    } else {
      this.setState(prevState => ({
        sandstorm: {
          hatch: prevState.sandstorm.hatch,
          cargo: stateNum
        }
      }))
    }
  }

  Sandstorm = ({ hatch, cargo, handler }) => (
    <View>
      <CheckBox
        title='Click Here'
        checked={true}
      />
      <PlusMinusMenu title="Hatch" num={hatch} isHatch={true} handler={handler} />
      <PlusMinusMenu title="Cargo" num={cargo} isHatch={false} handler={handler} />
    </View>
  );

  render() {
    const screenWidth = Dimensions.get('window').width;
    const {navigate} = this.props.navigation;
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
        <FlatList
          style={styles.container}
          data={[
            {key: 'Sandstorm', content: (<this.Sandstorm hatch={this.state.sandstorm.hatch} cargo={this.state.sandstorm.cargo} handler={this.sandstormHandler} />)},
            {key: 'Statistics', content: this.Statistics},
            {key: 'Recent Matches', content: this.RecentMatches},
            {key: 'Rankings', content: this.Rankings},
            {key: '', content: (<View></View>), style: {opacity: 0}}
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
    marginRight: 5,
    borderRadius: 5
  },
  plusOne: {
    flex: 1,
    backgroundColor: PLUS_ONE_COLOR,
    alignItems: 'center',
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
});