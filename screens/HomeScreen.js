import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  FlatList,
  Platform,
  AsyncStorage,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Card from '../other/Card.js';
import Touchable from 'react-native-platform-touchable';
import {
  SafeAreaView,
  StackActions,
  NavigationActions
} from 'react-navigation';

const ACCENT_COLOR = '#03b0ff';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamNumber: this.props.navigation.getParam('teamNumber', null),
      events: [],
      refreshing: false,
    };
  }
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  _removeItem = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // Error saving data
    }
  };

  logOut(dispatch, resetAction) {
    this._removeItem('teamNumber');
    dispatch(resetAction)
  }

  _storeData = async (data) => {
    try {
      await AsyncStorage.setItem('selectedEvent', data);
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async () => {
    try {
      return await AsyncStorage.getItem('selectedEvent');
    } catch (error) {
      // Error retrieving data
    }
  };

  async getEvents() {
    let year = (new Date()).getFullYear();
    fetch('https://www.thebluealliance.com/api/v3/team/frc' + this.state.teamNumber + '/events/' + year, {
      method: 'GET',
      headers: {
        "X-TBA-Auth-Key": "obG6uZ1OpPJxlW90yIivbojMth5LvH4iu1N4y7x3KHXHjhOl6BZ2GIusJ75VjQm8",
      },
    }).then((response) => {
      let body = JSON.parse(response._bodyText);
      body.sort((a, b) => parseFloat(a.week) - parseFloat(b.week));
      this.setState({events: body})
    });
  }

  EventCard = (event) => {
    return (
      <Card title={event.event.name} content={(
        <View>
          <Text style={styles.cardText}>
            <Text style={styles.cardTitle}>Date: </Text>
            {event.event.start_date} to {event.event.end_date}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.cardTitle}>Location: </Text>
            {event.event.location_name}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.cardTitle}>Address: </Text>
            {event.event.address}
          </Text>
        </View>
      )} handler={() => {
        this._storeData(JSON.stringify(event.event));
        this.props.navigation.navigate('Event', {event: event.event, teamNumber: this.state.teamNumber})
      }}/>
    )};

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getEvents().then(() => this.setState({refreshing: false}));
  };

  componentDidMount() {
    this.getEvents();
    let navigate = this.props.navigation.navigate;
    let teamNumber = this.state.teamNumber
    this._retrieveData().then(function(selectedEvent) {
      if (selectedEvent !== null) {
        navigate('Event', {event: JSON.parse(selectedEvent), teamNumber: teamNumber});
      }
    });
  }

  render() {
    const screenWidth = Dimensions.get('window').width;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Login'}),
      ],
    });

    let content = (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        <Text style={[styles.cardText, {textAlign: 'center'}]}>There are no events to display</Text>
      </ScrollView>
    );
    if (this.state.events.length > 0) {
      content = (
        <FlatList
          style={styles.container}
          data={this.state.events}
          renderItem={({item}) => <this.EventCard event={item} />}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />
      )
    }
    return (
      <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'never'}}>
        <View style={[styles.header, { width: screenWidth, padding: screenWidth * 0.02 }]}>
          <Touchable background={Touchable.Ripple('#a0a0a0', false)}
                     onPress={() => this.logOut(this.props.navigation.dispatch, resetAction)}
                     style={styles.logOutButton}>
            <Ionicons name={
              Platform.OS === 'ios'
                ? 'ios-log-out'
                : 'md-log-out'
            } size={30} color='#000' />
          </Touchable>
          <Text style={styles.title}>Events</Text>
        </View>
        {content}
      </SafeAreaView>
    );
  }
}

// TODO: Add box shadow for android (shadow props only support iOS)
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    flex: 1,
    alignContent: 'center',
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
    marginBottom: 15,
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
  logOutButton: {
    position: 'absolute',
    left: 25,
    top: 5,
    transform: [
      {rotateY: '180deg'}
    ]
  }
});