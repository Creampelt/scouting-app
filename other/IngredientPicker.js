import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Picker,
  StyleSheet,
  Modal,
  Text,
} from 'react-native'
import Touchable from 'react-native-platform-touchable';

const PICKER_HEIGHT = 25;

export default class IngredientPicker extends Component {
  state = {
    item: this.props.item
  };
  itemsArr = this.props.itemsArr;
  pickerItems = this.itemsArr.map(item => (
    <Picker.Item label={item} value={item} key={item} />
  ));

  render() {
    return (
      <View>
        <Touchable background={Touchable.Ripple('#bb9834', true)}
                   style={styles.touchable}
                   onPress={() => (this.props.handler(true))}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.touchableTitleText, {textAlign: 'left'}]}>{this.props.category}</Text>
            <Text style={styles.touchableText}>{this.state.item}</Text>
          </View>
        </Touchable>
        <Modal
          animationType="slide"
          transparent={this.props.modalVisible}
          presentationStyle='overFullScreen'
          style={{height: '100%'}}
          onRequestClose={() => this.props.handler(false)}>
          <View>
            <TouchableOpacity style={styles.container}
                              activeOpacity={styles.container.opacity}
                              onPress={() => (this.props.handler(false))} />
            <Picker selectedValue={this.state.item}
                    onValueChange={(item) => {this.setState({item: item})}}
                    style={styles.picker}
                    itemStyle={styles.pickerItems}>
              {this.pickerItems}
            </Picker>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerItems: {
    fontSize: 20,
    margin: 0
  },
  container: {
    height: 100 - PICKER_HEIGHT + '%',
    backgroundColor: 'transparent',
    opacity: 1,
  },
  picker: {
    backgroundColor: '#bfbfbf',
    width: '100%',
    height: PICKER_HEIGHT + '%',
  },
  touchable: {
    backgroundColor: 'white',
    padding: 20,
  },
  touchableText: {
    textAlign: 'center',
    color: '#7c7c7c',
    fontSize: 20,
    fontFamily: 'open-sans',
    marginLeft: 'auto',
  },
  touchableTitleText: {
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'open-sans',
  }
});