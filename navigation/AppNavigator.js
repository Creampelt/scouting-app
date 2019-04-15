import React from "react";
import {
  createAppContainer,
  createStackNavigator
} from "react-navigation";

import EventScreen from "../screens/EventScreen";
import HomeScreen from "../screens/HomeScreen";
import ScoutScreen from "../screens/ScoutScreen";
import LoginScreen from "../screens/LoginScreen";

const MainNavigator = createStackNavigator({
  Login: {screen: LoginScreen},
  Home: {screen: HomeScreen},
  Event: {screen: EventScreen},
  Scouting: {screen: ScoutScreen}
});

const App = createAppContainer(MainNavigator);

export default App;