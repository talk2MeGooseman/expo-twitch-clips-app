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

const TAB1_NAME = "Most Viewed";
const TAB2_NAME = "Trending";

const BUTTONS = ["25 Clips", "50 Clips", "75 Clips", "100 clips", "Cancel"];
const CLIPS_25 = "0";
const CLIPS_50 = "1";
const CLIPS_75 = "2";
const CLIPS_100 = "3";
const CANCEL_INDEX = 4;

class TrendingClipsView extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      drawerLabel: 'Top Clips',
      title: 'Trending Clips',
      headerTitle: <Title>Top Clips</Title>,
      headerLeft: <Button onPress={() => { navigation.navigate('DrawerOpen'); }}><Icon name="menu" /></Button>,
    };
  };
  componentDidMount() {
    this.fetchVideos();
    this.props.navigation.setParams({ onFunnelClick: this._displayFilterOption });
  }

  componentDidUpdate(prevProps){
    if (prevProps.trending_count !== this.props.trending_count) {
      this.fetchVideos();
    }
  }

  toggleVideoOverlay(url) {
    this.props.navigation.navigate('VideoPlayerView', { embedUrl: url });
  }

  fetchVideos = () => {
    let { dispatch } = this.props.navigation;
    dispatch(fetchTrendingClips(this.props.trending_count));
  }

  _displayFilterOption = () => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: "Number of Clips"
      },
      this._userSelectedOption.bind(this)
    )
  }

  _userSelectedOption(index) {
    let count = this.props.count;
    switch (index) {
      case CLIPS_25:
        count = 25;
        break;
      case CLIPS_50:
        count = 50;
        break;
      case CLIPS_75:
        count = 75;
        break;
      case CLIPS_100:
        count = 100;
        break;
      default:
        break;
    }
    
    let { dispatch } = this.props.navigation;
    dispatch(setTrendingClipsCount(count));
  }

  _renderHeader = () => {
    return (
      <View style={styles.buttonArea}>
        <Button light small onPress={ this._displayFilterOption } ><Icon name="ios-funnel" /></Button>
      </View>
    );
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
            renderHeader={this._renderHeader}
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
  },
  buttonArea: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'flex-end',
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