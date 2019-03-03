import React, { Fragment } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Touchable from "react-native-platform-touchable";
import { ModalProvider, ModalConsumer } from './ModalContext';
import ModalRoot from './ModalRoot';
import IngredientPicker from './IngredientPicker';

const bread = ['Dutch crunch', 'Sourdough roll', 'Ciabatta roll', 'Sliced wheat', 'Sliced Sourdough', 'Gluten free'];
const meat = ['None', 'Turkey', 'Roast beef', 'Pastrami', 'Salami', 'Ham', 'Tuna salad', 'Egg salad'];

const EventModal = ({ onRequestClose, event }) => (
  <Modal
    isOpen
    onRequestClose={onRequestClose}
    animationType="slide"
    transparent={true}
    presentationStyle='overFullScreen'
    style={{height: '100%'}}
  >
    {event}
  </Modal>
);

const breadModal = ({ onRequestClose, changeItem, item }) => (
  <EventModal
    onRequestClose={onRequestClose}
    event={
      <IngredientPicker
        changeItem={changeItem}
        itemsArr={bread}
        handler={onRequestClose}
        item={item}
        category='Bread' />
    }
  />
);

const meatModal = ({ onRequestClose }) => (
  <EventModal
    onRequestClose={onRequestClose}
    event={
      <IngredientPicker
        itemsArr={meat}
        handler={onRequestClose}
        category='Meat' />
    }
  />
);

const IngredientTouchable = ({ showModal, modal, category, item }) => (
  <Touchable background={Touchable.Ripple('#bb9834', true)}
             style={styles.touchable}
             onPress={() => (showModal(modal))}>
    <View style={{flexDirection: 'row'}}>
      <Text style={[styles.touchableTitleText, {textAlign: 'left'}]}>{category}</Text>
      <Text style={styles.touchableText}>{item}</Text>
    </View>
  </Touchable>
);

export default class EventModals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breadItem: 'Please select',
      meatItem: 'None',
    };
  }

  render() {
    return(
      <ModalProvider>
        <ModalRoot />
        <ModalConsumer>
          {({ showModal }) => (
            <Fragment>
              <IngredientTouchable showModal={showModal} category='Bread' modal={breadModal} />
              <IngredientTouchable showModal={showModal} category='Meat' modal={meatModal} />
            </Fragment>
          )}
        </ModalConsumer>
      </ModalProvider>
    )
  }
}

const styles = StyleSheet.create({
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