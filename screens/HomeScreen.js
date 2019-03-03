import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
} from "react-native";
import Card from '../other/Card.js';
import Touchable from 'react-native-platform-touchable';
import { SafeAreaView } from 'react-navigation';
import Table from '../other/Table.js';

const ACCENT_COLOR = '#03b0ff';
const ACCENT_COLOR_DARK = '#0374b2';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  UpcomingMatches = (
    <Table headers={['Red Alliance', 'Blue Alliance', 'Time']}
           tableData={[
             ['254, 973, 971', '254, 973, 971', '2:30'],
             ['254, 973, 971', '6418, 5499, 973', '2:35'],
             ['254, 973, 971', '254, 973, 971', '2:40'],
             ['254, 973, 971', '6418, 5499, 973', '2:45']
           ]} />
  );

  Statistics = (
    <View>
      <Text>
        <Text style={styles.cardTitle}>Top Pick: </Text>
        <Text style={styles.cardText}>254</Text>
      </Text>
      <Text>
        <Text style={styles.cardTitle}>Best Cargo Bot: </Text>
        <Text style={styles.cardText}>973</Text>
      </Text>
      <Text>
        <Text style={styles.cardTitle}>Best Hatch Bot: </Text>
        <Text style={styles.cardText}>254</Text>
      </Text>
      <Text>
        <Text style={styles.cardTitle}>Best Buddy Climb: </Text>
        <Text style={styles.cardText}>1678</Text>
      </Text>
    </View>
  );

  RecentMatches = (
    <Table headers={['Match', 'Red Alliance', 'Blue Alliance']}
           tableData={[
             ['Qual 4', '254, 973, 971', '254, 973, 971'],
             ['Qual 3', '254, 973, 971', '6418, 5499, 973'],
             ['Qual 2', '254, 973, 971', '254, 973, 971'],
             ['Qual 1', '254, 973, 971', '6418, 5499, 973'],
           ]} />
  );

  Rankings = (
    <Table headers={['Rank', 'Team Name', 'Team Number']}
           tableData={[
             ['1', 'Cheesy Poofs', '254'],
             ['2', 'The Missfits', '6418'],
             ['3', 'Greybots', '973'],
             ['4', 'Spartan Robotics', '971'],
           ]} />
  );

  render() {
    const screenWidth = Dimensions.get('window').width;
    return (
      <View style={{backgroundColor: '#fff'}}>
        <SafeAreaView>
          <View
            style={[styles.header, { width: screenWidth, padding: screenWidth * 0.02 }]}>
            <Text style={styles.title}>Home</Text>
          </View>
          <View style={{ zIndex: 1000 }}>
            <View style={[styles.scoutButton, {
              left: 55,
              backgroundColor: ACCENT_COLOR_DARK,
              width: screenWidth - 110
            }]}>
              <Text style={[styles.scoutButtonText, {opacity: 0.5}]}>Scout a match</Text>
            </View>
            <Touchable
              background={Touchable.Ripple(ACCENT_COLOR_DARK, true)}
              onPress={() => console.log('Touchable pressed')}>
              <View style={[styles.scoutButton, {
                left: 55,
                width: screenWidth - 110
              }]}>
                <Text style={styles.scoutButtonText}>Scout a match</Text>
              </View>
            </Touchable>
          </View>
          <FlatList
            style={styles.container}
            data={[
              {key: 'Upcoming Matches', content: this.UpcomingMatches},
              {key: 'Statistics', content: this.Statistics},
              {key: 'Recent Matches', content: this.RecentMatches},
              {key: 'Rankings', content: this.Rankings}
            ]}
            renderItem={({item}) => <Card title={item.key} content={item.content} />}
          />
        </SafeAreaView>
      </View>
    );
  }
}

// TODO: Add box shadow for android (shadow props only support iOS)
const styles = StyleSheet.create({
  container: {
    paddingTop: 52.5,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    height: '100%',
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
    top: -65 / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  }
});