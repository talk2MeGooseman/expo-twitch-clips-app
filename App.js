import React, { Component } from 'react';
import {
  AppRegistry,
  UIManager,
  Platform,
} from 'react-native';
import ReduxNavigation from './app/views/ReduxNavigation';
import AppReducer from './app/redux/CombineReducers';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux'

const thunk = store => {  
  const dispatch = store.dispatch
  const getState = store.getState

  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    console.log(action)
    return next(action)
  }
}

const store = createStore(AppReducer, applyMiddleware(thunk));

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