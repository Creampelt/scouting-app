import React from 'react';
import {createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LinksScreen from "../screens/LinksScreen";
import HomeScreen from "../screens/HomeScreen";
import ScoutScreen from "../screens/ScoutScreen";

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Links: {screen: LinksScreen},
  Scouting: {screen: ScoutScreen}
});

const App = createAppContainer(MainNavigator);

export default App;

/*
export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
}));
*/