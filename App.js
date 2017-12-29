import React, { Component } from 'react';
import {
  AppRegistry,
  UIManager,
  Platform,
} from 'react-native';
import ReduxNavigation from './app/views/ReduxNavigation';
import { Provider } from 'react-redux'
import store from './app/redux/configureStore'

export default class TwitchDashboardApp extends Component {
  constructor() {
    super();

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) { 
      UIManager.setLayoutAnimationEnabledExperimental(true); 
    }
  }

  render() {
    return (
      <Provider store={store}>
        <ReduxNavigation />
      </Provider>
    );
  }
};

AppRegistry.registerComponent('TwitchDashboardApp', () => TwitchDashboardApp);