import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  Modal,
} from "react-native";
import Touchable from 'react-native-platform-touchable';
import IngredientPicker from './IngredientPicker';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.state = {
      modalVisible: {
        Bread: false
      }
    }
  }

  setModalVisible(visible, varToSet) {
    this.setState({modalVisible: {'_varToSet': visible}});
  }

  bread = ['Dutch crunch', 'Sourdough roll', 'Ciabatta roll', 'Sliced wheat', 'Sliced Sourdough', 'Gluten free'];
  meat = ['None', 'Turkey', 'Roast beef', 'Pastrami', 'Salami', 'Ham', 'Tuna salad', 'Egg salad'];
  cheese = ['Provolone', 'Swiss', 'Cheddar', 'Fresh mozzarella'];
  condiments = ['Mayo', 'Mustard', 'Pesto', 'Red vin/olive oil', 'Balsamic vin/olive oil', 'Roasted red peppers',
    'Pepperoncini', 'Pickles', 'Basil', 'Lettuce', 'Tomatoes', 'Hummus', 'Red onions', 'Jalapenos', 'Artichoke hearts'];
  extras = ['Avocado', 'Bacon', 'Meat'];

  static navigationOptions = {
    header: null
  };

  render() {
    const screenWidth = Dimensions.get('window').width;
    console.log(this.state.modalVisible["Bread"]);
    return (
      <View style={{ alignContent: 'center' }}>
        <View style={[styles.header, { width: screenWidth, padding: screenWidth * 0.05, paddingTop: screenWidth * 0.05 + 30 }]}>
          <Text style={styles.title}>Place an order</Text>
          <View style={styles.buttonsContainer}>
            <Touchable>
              <View style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </View>
            </Touchable>
            <Touchable>
              <View style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Done</Text>
              </View>
            </Touchable>
          </View>
        </View>
        <ScrollView style={styles.container}>
          <IngredientPicker category='Bread' itemsArr={this.bread} item='Please select' handler={this.setModalVisible} modalVisible={this.state.modalVisible.bread}/>
        </ScrollView>
      </View>
    );
  }
}

// TODO: Add box shadow for android (shadow props only support iOS)
const styles = StyleSheet.create({
  container: {
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
    alignItems: 'center',
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    marginLeft: 0,
  },
  buttonsContainer: {
    zIndex: 1000,
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  doneButton: {
    backgroundColor: '#ffd541',
    width: 85,
    height: 50,
    borderRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  doneButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontFamily: 'open-sans-bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    width: 85,
    height: 50,
    borderRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#7c7c7c',
    fontSize: 20,
    fontFamily: 'open-sans',
  },
});