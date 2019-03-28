import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  FlatList,
  Platform,
  AsyncStorage,
  RefreshControl
} from "react-native";
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import CardNonTouchable from '../other/CardNonTouchable.js';
import Touchable from 'react-native-platform-touchable';
import { SafeAreaView } from 'react-navigation';
import Table from '../other/Table.js';
import Card from "../other/Card";
import * as firebase from 'firebase';

const ACCENT_COLOR = '#03b0ff';
const ACCENT_COLOR_DARK = '#0374b2';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDlSxCXqPgjwBZTJOsstAuTdORwAf6De0E",
  authDomain: "scouting-app-5ec8f.firebaseapp.com",
  databaseURL: "https://scouting-app-5ec8f.firebaseio.com",
  storageBucket: "scouting-app-5ec8f.appspot.com"
};

firebase.initializeApp(firebaseConfig);

function sum(arr) {
  return arr.reduce((a, b) => a + b);
}

function goToSheet(teamNumber, regional) {
  return firebase.database().ref(teamNumber + '/' + regional).once('value').then((snapshot) => {
    let spreadsheetId = snapshot.val().spreadsheetId;
    if (spreadsheetId === undefined) createSheet(teamNumber, regional);
    else openSheet(spreadsheetId);
  });
}

function createSheet(teamNumber, regional) {
  fetch(`https://us-central1-scouting-app-5ec8f.cloudfunctions.net/createDataSheet?teamNumber=${teamNumber}&event=${regional}`,{
    method: 'GET',
  }).then((response) => {
    console.log('Response from HTTP request:', response);
    WebBrowser.openBrowserAsync(response._bodyText());
  });
}

function openSheet(spreadsheetId) {
  WebBrowser.openBrowserAsync(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
}

const Statistics = (data) => {
  data = data.data;
  let component = null;
  if (data.length > 0) {
    component = (
      <View>
        <Table headers={['Team #', 'Hatch Total', 'Cargo Total', 'Hab Climb']}
               tableData={data} />
      </View>
    )
  } else {
    component = (
      <Text style={styles.cardText}>Could not fetch statistics</Text>
    )
  }
  console.log(component);
  return component;
};

function renderRankings(rankings, teamNumber) {
  if (rankings.length !== 0) {
    let tableData = rankings.slice(0, 8);
    let headerArr = ['Rank', 'Team', 'Record (W-L-T)'].map((cellData, cellIndex) => (
      <View key={cellIndex} style={styles.cell}>
        <Text style={[styles.cellText, {fontFamily: 'open-sans-bold'}]}>{cellData}</Text>
      </View>
    ));
    let tableArr = tableData.map((rowData, rowIndex) => {
      let thisTeam = {};
      if (rowData[1].toString() === teamNumber.toString()) {
        thisTeam = {fontFamily: 'open-sans-bold', backgroundColor: ACCENT_COLOR, color: '#fff'};
      }
      return (
        <View key={rowIndex} style={styles.row}>
          {rowData.map((cellData, cellIndex) => (
            <View key={cellIndex} style={[styles.cell, thisTeam]}>
              <Text style={[styles.cellText, thisTeam]}>{cellData}</Text>
            </View>
          ))}
        </View>
      )
    });

    return (
      <View>
        <View style={styles.row}>{headerArr}</View>
        {tableArr}
      </View>
    );
  } else return <Text style={styles.cardText}>Could not fetch rankings</Text>;
}

export default class EventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamNumber: this.props.navigation.getParam('teamNumber', ''),
      event: this.props.navigation.getParam('event', null),
      rankings: [],
      refreshing: false,
      processedData: [],
    };
    this.setState = this.setState.bind(this);
  }
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getRankings().then(() => {
      this.getScoutingData(this.state.teamNumber, this.state.event.name).then(() => this.setState({refreshing: false}));
    });
  };

  GoogleSheet = (
    <View>
      <Text style={{fontFamily: 'open-sans', fontSize: 14}}>
        <Text style={{fontFamily: 'open-sans-bold'}}>Click here</Text> to go to a Google Sheet containing your data.
        Don't worry about adding data as you go along. The sheet will automatically update when you scout matches.
      </Text>
    </View>
  );

  Rankings = (rankings) => (
    <Table tableData={rankings.rankings} headers={['test', 'test', 'test']} />
  );

  _removeItem = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // Error saving data
    }
  };

  async getScoutingData(teamNumber, regional) {
    return firebase.database().ref(teamNumber + '/' + regional + '/matchData').once('value').then((snapshot) => {
      let matchData = snapshot.val();
      let tableData = [];
      for (let team in matchData) {
        if (matchData.hasOwnProperty(team)) {
          let teamData = matchData[team];
          let keys = Object.keys(teamData);
          let lastKey = keys[keys.length - 1];
          let lastMatch = teamData[lastKey];
          let allHatch = [lastMatch.cargoShip.cargoShipHatch, ...Object.values(lastMatch.rocket.hatch)];
          let allCargo = [lastMatch.cargoShip.cargoShipCargo, ...Object.values(lastMatch.rocket.cargo)];
          let climb = (lastMatch.endgame.habClimb === 0 ? 'None' : `Level ${lastMatch.endgame.habClimb}`);
          let rowData = [team, sum(allHatch), sum(allCargo), climb];
          tableData.push(rowData);
        }
      }
      this.setState({processedData: tableData});
    })
  }

  async getRankings() {
    let key = this.state.event.key;
    let rankings = [];
    let teamNumber = '';
    let record = '';
    let recordRaw = {};
    fetch('https://www.thebluealliance.com/api/v3/event/' + key + '/rankings', {
      method: 'GET',
      headers: {
        "X-TBA-Auth-Key": "obG6uZ1OpPJxlW90yIivbojMth5LvH4iu1N4y7x3KHXHjhOl6BZ2GIusJ75VjQm8",
      },
    }).then((response) => {
      if (response._bodyText !== "null") {
        let body = JSON.parse(response._bodyText).rankings;
        for (let i in body) {
          if (body.hasOwnProperty(i)) {
            teamNumber = body[i].team_key.slice(3);
            recordRaw = body[i].record;
            record = recordRaw.wins + '-' + recordRaw.losses + '-' + recordRaw.ties;
            rankings.push([body[i].rank, teamNumber, record]);
          }
        }
        this.setState({rankings: rankings});
      }
    });
  }

  componentDidMount() {
    this.getRankings();
    this.getScoutingData(this.state.teamNumber, this.state.event.name);
  }

  render() {
    const screenWidth = Dimensions.get('window').width;
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'never'}}>
        <View style={[styles.header, { width: screenWidth, padding: screenWidth * 0.02 }]}>
          <Touchable background={Touchable.Ripple('#a0a0a0', false)}
                     onPress={() => {
                       this._removeItem('selectedEvent');
                       this.props.navigation.pop()
                     }}
                     style={styles.backButton}>
            <Ionicons name={
              Platform.OS === 'ios'
                ? 'ios-arrow-back'
                : 'md-arrow-back'
            } size={30} color='#000' />
          </Touchable>
          <Text style={styles.title}>{this.state.event.name}</Text>
          <Touchable background={Touchable.Ripple(ACCENT_COLOR_DARK, true)}
                     onPress={() => navigate('Scouting', {teamNumber: this.state.teamNumber, event: this.state.event})}
                     style={[styles.scoutButton, {left: 55, width: screenWidth - 110}]}>
            <Text style={styles.scoutButtonText}>Scout a match</Text>
          </Touchable>
        </View>
        <FlatList
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          data={[
            {key: 'Rankings', content: renderRankings(this.state.rankings, this.state.teamNumber), touchable: false},
            {key: 'Ready to make a pick list?', content: this.GoogleSheet, handler: () => goToSheet(this.state.teamNumber,
                this.state.event.name), touchable: true},
            {key: 'Recent Statistics', content: <Statistics data={this.state.processedData} />, touchable: false},
            {key: '', content: (<View />), style: {opacity: 0}, touchable: false}
          ]}
          renderItem={({item}) => (
            item.touchable
              ? <Card title={item.key} content={item.content} style={item.style} handler={item.handler} />
              : <CardNonTouchable title={item.key} content={item.content} style={item.style} />
          )}
        />
      </SafeAreaView>
    );
  }
}

// TODO: Add box shadow for android (shadow props only support iOS)
const styles = StyleSheet.create({
  container: {
    paddingTop: 52.5,
    paddingHorizontal: 20,
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
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    marginBottom: 35,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  scoutButton: {
    backgroundColor: ACCENT_COLOR,
    width: 100,
    height: 65,
    borderRadius: 75 / 2,
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -65.0/2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 1000,
  },
  scoutButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontFamily: 'open-sans-extra-bold',
  },
  cardTitle: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
  },
  cardText: {
    fontFamily: 'open-sans',
    fontSize: 16,
  },
  backButton: {
    left: 25,
    top: 5,
    position: 'absolute'
  },
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  cell: {
    alignSelf: 'stretch',
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 3,
  },
  cellText: {
    fontFamily: 'open-sans',
    textAlign: 'center',
    fontSize: 14,
  },
});