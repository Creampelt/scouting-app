import React from 'react';
import {
  View,
  StyleSheet,
  Text, Platform,
} from "react-native";

const FONT_MULTIPLIER = (Platform.OS === "ios" ? 1 : 0.9);

export default class CardNonTouchable extends React.Component {
  render() {
    return (
      <View style={[styles.cardContainer, this.props.style]}>
        <View>
          <Text style={styles.title}>{this.props.title}</Text>
          {this.props.content}
        </View>
      </View>
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
    elevation: 3,
    borderRadius: 4,
    shadowRadius: 4,
    marginBottom: 20
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18 * FONT_MULTIPLIER,
    marginBottom: 5,
  },
  bold: {
    fontFamily: 'open-sans-bold',
    fontSize: 14 * FONT_MULTIPLIER,
  }
});