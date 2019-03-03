import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from "react-native";
import Touchable from 'react-native-platform-touchable';


export default class Card extends React.Component {
  render() {
    return (
      <Touchable background={Touchable.Ripple('#bb9834', true)}
                 onPress={() => console.log('Touchable pressed')}
                 style={styles.cardContainer}>
        <View>
          <Text style={styles.title}>{this.props.title}</Text>
          {this.props.content}
        </View>
      </Touchable>
    );
  }
}

// TODO: Add box shadow for android (shadow props only support iOS)
const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 2
    },
    shadowOpacity: 0.1,
    borderRadius: 4,
    shadowRadius: 4,
    marginBottom: 20
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    marginBottom: 5,
  },
  bold: {
    fontFamily: 'open-sans-bold',
    fontSize: 14,
  }
});