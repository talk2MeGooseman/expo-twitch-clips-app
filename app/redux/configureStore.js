import AppReducer from './CombineReducers';
import { applyMiddleware, createStore } from 'redux';

const thunk = store => {  
  const dispatch = store.dispatch
  const getState = store.getState

  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    return next(action)
  }
}

const store = createStore(AppReducer, applyMiddleware(thunk));

export default store;