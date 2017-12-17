import React, {
    Component,
} from 'react';
import {
    StyleSheet,
    Text,
    FlatList,    
} from 'react-native';
import {
    Container,
    Spinner,
} from 'native-base';
import ClipCard from '../components/ClipCard';
import ListFooter from "../components/ListFooter";
import EmptyListText from "../components/EmptyListText";
import { connect } from 'react-redux';
import { fetchUsersVideos, refreshUserVideos} from '../redux/actions/userVideoActions';
import { removeBookmark, addBookmark } from '../redux/actions/bookmarkActions';

class UserVideosView extends Component {
    static navigationOptions = ({navigation}) => {
        return({
            headerTitle: navigation.state.params.display_name,
            title: 'videos'
        });
    };

    componentDidMount() {
        this.refreshUsersVideos();
    }

    async refreshUsersVideos() {
        let offset = this.props.videos.length;
        let channel_id = this.props.navigation.state.params._id;
        let { dispatch } = this.props.navigation;
        dispatch(refreshUserVideos(channel_id, offset));
    }

    endReached = () => {
        if(this.props.loading) return;                
        if(this.props.videos.length >= this.props.total) {
            return;
        }

        let { dispatch } = this.props.navigation;
        let offset = this.props.videos.length;
        let channel_id = this.props.navigation.state.params._id;
        dispatch(fetchUsersVideos(channel_id, offset));
    }

    toggleVideoOverlay = (url) => {
        this.props.navigation.navigate('VideoPlayerView', { embedUrl: url});
    }

    _onBookmarkPress = (id) => {
        const data = this.props.videos.find((video) => {
          return video._id === id;
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

    addVideoCard = ({item: video}) => {
        let bookmarked = false;
        if (this.props.bookmarks) {
            const bookmarks = this.props.bookmarks;
            bookmarked = bookmarks[video._id] ? true : false;
        }

        const passProps = {
            username: video.channel.display_name,
            id: video._id,
            user_id: `${video.channel._id}`,
            image_url: video.preview.medium,
            views: video.views,
            duration: video.length,
            game_title: video.game,
            created_at: video.created_at,
            url: video.url,
            title: video.title,
            onImagePress: this.toggleVideoOverlay,
            broadcast_type: video.broadcast_type,
            onBookmarkPress: (id) => { this._onBookmarkPress(id) },
            bookmarked: bookmarked,
        };

        return <ClipCard { ...passProps } />;
    }

    renderEmptyList = () => {
        return <EmptyListText loading={this.props.loading} refreshing={this.props.refreshing} />
    }

    renderFooter = () => {
        return <ListFooter loading={this.props.loading} />
    }

    onRefresh = () => {
       this.refreshUsersVideos(); 
    }

    render() {
        return(
            <Container>
                <FlatList
                    style={styles.content}
                    data={this.props.videos}
                    keyExtractor={(item) => item._id}
                    renderItem={this.addVideoCard} 
                    onEndReached={this.endReached}
                    onEndReachedThreshold={0.50}
                    ListFooterComponent={this.renderFooter()}
                    ListEmptyComponent={this.renderEmptyList()}
                    onRefresh={this.onRefresh}
                    refreshing={this.props.refreshing}
                /> 
            </Container>            
        );
    }
}

const styles = StyleSheet.create({
    content: {
      backgroundColor: 'gray',
    },
});

const mapStateToProps = state => ({
    videos: state.userVideos.videos,
    total: state.userVideos.total,
    loading: state.userVideos.loading,
    refreshing: state.userVideos.refreshing,
    bookmarks: state.bookmarks.bookmarks,
});

export default connect(mapStateToProps)(UserVideosView);