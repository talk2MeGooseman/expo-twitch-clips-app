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
    this.state = {
      ready: false,
    }

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) { 
      UIManager.setLayoutAnimationEnabledExperimental(true); 
    }
  }

  async componentWillMount() {

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) { 
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      });
    }

    this.setState({
      ready: true
    });
  }

  Setup() {
    if (this.state.ready) {
      return (
        <Provider store={store}>
          <ReduxNavigation />
        </Provider>
      );
    } else {
      return '';      
    }
  }

  render() {
    return this.Setup();
  }
};

AppRegistry.registerComponent('TwitchDashboardApp', () => TwitchDashboardApp);