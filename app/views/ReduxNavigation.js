import React from "react";
import { BackHandler } from "react-native";
import { Root } from 'native-base';
import { connect } from 'react-redux'
import { addNavigationHelpers, NavigationActions } from "react-navigation";
import AppNavigation from '../navigation/AppNavigation';

const mapStateToProps = state => ({ nav: state.nav });

class ReduxNavigation extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  
  onBackPress = () => {
    const { dispatch, nav } = this.props;

    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: nav
    });

    return(
      <Root>
        <AppNavigation navigation={navigation} />
      </Root>
    );
  }
};

export default connect(mapStateToProps)(ReduxNavigation);