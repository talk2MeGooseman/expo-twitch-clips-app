import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Icon, Title } from "native-base";
import { connect } from 'react-redux';
import { removeBookmark, addBookmark } from '../redux/actions/bookmarkActions';
import ClipCard from '../components/ClipCard';

class FavoritesView extends Component {
    static navigationOptions = ({navigation}) => {
        return({
            title: 'Your Favorites',
            headerTitle: <Title>Your Favorites</Title>,
            headerLeft: <Button onPress={() => { navigation.navigate('DrawerOpen'); }}><Icon name="menu" /></Button>,
        });
    };

    toggleVideoOverlay = (url) => {
        this.props.navigation.navigate('VideoPlayerView', { embedUrl: url});
    }

    _onBookmarkPress = (id) => {
        const data = this.props.bookmarks[id];
        
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

    _addCard = ({item: video}) => {
        let bookmarked = false;
        if (this.props.bookmarks) {
            const bookmarks = this.props.bookmarks;
            bookmarked = bookmarks[video.id] ? true : false;
        }

        // Handle corner cases for difference between video and clips
        let channel = video.hasOwnProperty('channel') ? video.channel : video.broadcaster;
        let thumbnails = video.hasOwnProperty('preview') ? video.preview : video.thumbnails;

        const passProps = {
            username: channel.display_name,
            id: video.id,
            user_id: `${channel.id || channel._id}`, // This still weird to do
            image_url: thumbnails.medium,
            views: video.views,
            duration: video.length || video.duration,
            game_title: video.game,
            created_at: video.created_at,
            url: video.embed_url || video.url,
            title: video.title,
            onImagePress: this.toggleVideoOverlay,
            broadcast_type: video.broadcast_type || 'highlight',
            onBookmarkPress: (id) => { this._onBookmarkPress(id) },
            bookmarked: bookmarked,
        };

        return <ClipCard { ...passProps } />;
    }

    render() {
        let bookmarksArray = [];
        Object.keys(this.props.bookmarks).map((id) => {
            bookmarksArray.push(this.props.bookmarks[id]);
        });

        return (
            <View>
                <FlatList
                    data={bookmarksArray}
                    renderItem={(item) => this._addCard(item) }
                    keyExtractor={ (video) => video.id }
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    bookmarks: state.bookmarks.bookmarks,
});

export default connect(mapStateToProps)(FavoritesView);
