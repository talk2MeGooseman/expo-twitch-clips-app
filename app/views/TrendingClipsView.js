/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { 
  Container,
  Button,
  Icon,
  Title,
  ActionSheet
} from 'native-base';
import ClipsList from '../components/ClipsList';
import { fetchTrendingClips, setTrendingClipsCount } from "../redux/actions/topClipsActions";
import { connect } from 'react-redux';
import { addBookmark, removeBookmark } from '../redux/actions/bookmarkActions';
import openURL from '../services/openBrowser';

const TAB1_NAME = "Most Viewed";
const TAB2_NAME = "Trending";

class TrendingClipsView extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      drawerLabel: 'Top Clips',
      title: 'Trending Clips',
      headerTitle: <Title style={{ color: "#fff" }}>Top Clips</Title>,
      headerLeft: <Button onPress={() => { navigation.navigate('DrawerOpen'); }}><Icon name="menu" /></Button>,
    };
  };

  componentDidMount() {
    this._fetchVideos();
    this.props.navigation.setParams({ onFunnelClick: this._displayFilterOption });
  }

  componentDidUpdate(prevProps){
    if (prevProps.trending_count !== this.props.trending_count) {
      this._fetchVideos();
    }
  }

  toggleVideoOverlay(url) {
    // this.props.navigation.navigate('VideoPlayerView', { embedUrl: url });
    openURL(url);
  }

  _fetchVideos = () => {
    let { dispatch } = this.props.navigation;
    dispatch(fetchTrendingClips(this.props.cursor));
  }

  _onBookmarkPress = (id) => {
    const data = this.props.trending_clips.find((clip) => {
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
      <Container style={styles.container}>
        <View>
          <ClipsList
            toggleOverlay={this.toggleVideoOverlay.bind(this)}
            data={this.props.trending_clips}
            loading={this.props.loading}
            refreshing={this.props.refreshing}
            onBookmarkPress={(id) => { this._onBookmarkPress(id)} }
            bookmarks={this.props.bookmarks}
          />
        </View>
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
    trending_clips: state.topClips.trending_clips,
    trending_count: state.topClips.trending_count,
    loading: state.topClips.loading,
    refreshing: state.topClips.refreshing,
    bookmarks: state.bookmarks.bookmarks
});

export default connect(mapStateToProps)(TrendingClipsView);