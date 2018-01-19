/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { 
  Container,
  Button,
  Icon,
  Title,
  ActionSheet
} from 'native-base';
import ClipsList from '../components/ClipsList';
import { fetchSuggestedTopClips, setSuggestedClipsCount } from "../redux/actions/topClipsActions";
import { connect } from 'react-redux';
import { addBookmark, removeBookmark } from '../redux/actions/bookmarkActions';
import openURL from '../services/openBrowser';

class PopularClipsView extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      drawerLabel: 'Top Clips',
      title: 'Popular Clips',
      headerTitle: <Title style={{ color: "#fff" }}>Top Clips</Title>,
      headerLeft: <Button onPress={() => { navigation.navigate('DrawerOpen'); }}><Icon name="menu" /></Button>,
    };
  };

  componentDidMount() {
    this.fetchTopVideos();
    this.props.navigation.setParams({ onFunnelClick: this._displayFilterOption });
  }

  componentDidUpdate(prevProps){
    if (prevProps.suggested_count !== this.props.suggested_count) {
      this.fetchTopVideos();
    }
  }

  toggleVideoOverlay(url) {
    // this.props.navigation.navigate('VideoPlayerView', { embedUrl: url });
    openURL(url);
  }

  fetchTopVideos = () => {
    let { dispatch } = this.props.navigation;
    dispatch(fetchSuggestedTopClips(this.props.cursor));
  }

  _onBookmarkPress(id) {
    const data = this.props.top_clips.find((clip) => {
      return clip.tracking_id === id;
    });
    
    if (!data) {
      return;
    }

    const { dispatch } = this.props.navigation;
    if (this.props.bookmarks[id]) {
      data.id = id;
      dispatch(removeBookmark(data));
    } else {
      data.id = id;
      dispatch(addBookmark(data)); 
    }
  }

  render() {
    return (
      <Container>
        <ClipsList
          toggleOverlay={this.toggleVideoOverlay.bind(this)}
          data={this.props.top_clips}
          loading={this.props.loading}
          refreshing={this.props.refreshing}
          onBookmarkPress={(id) => this._onBookmarkPress(id) }
          bookmarks={this.props.bookmarks}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray'
  }
});

const mapStateToProps = state => ({
    top_clips: state.topClips.top_clips,
    loading: state.topClips.loading,
    refreshing: state.topClips.refreshing,
    bookmarks: state.bookmarks.bookmarks,
});

export default connect(mapStateToProps)(PopularClipsView);