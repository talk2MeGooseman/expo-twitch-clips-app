import React, {Component} from 'react';
import {View} from 'react-native';
import ClipsList from '../components/ClipsList';
import { connect } from 'react-redux';
import {
    Container,
} from 'native-base';
import { fetchUsersClips, fetchingUserClips, refreshUserClips } from '../redux/actions/userClipsActions';
import { removeBookmark, addBookmark } from '../redux/actions/bookmarkActions';

class UserClipsView extends Component {
    static navigationOptions = ({navigation}) => {
        return({
            headerTitle: navigation.state.params.display_name,
            title: 'Clips'
        });
    };

    constructor(props) {
        super(props);
    }

    getMoreClips() {
        if(!this.props.cursor) {
            console.log('No more items to grab');
            return;
        }

        const { dispatch } = this.props.navigation;
        let channel_name = this.props.navigation.state.params.display_name;
        dispatch(fetchUsersClips(channel_name, this.props.cursor));
    }

    componentDidMount() {
        this.refreshUsersClips();
    }

    refreshUsersClips = () => {
        const { dispatch } = this.props.navigation;
        let channel_name = this.props.navigation.state.params.display_name;
        dispatch(refreshUserClips(channel_name));
    }

    _onBookmarkPress = (id) => {
        const data = this.props.clips.find((clip) => {
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

    displayClips() {
        return(
            <ClipsList 
                data={this.props.clips}
                onFetchNextPage={this.getMoreClips.bind(this)}
                toggleOverlay={ this.toggleVideoOverlay.bind(this) } 
                refreshing={this.props.refreshing}
                onRefresh={this.refreshUsersClips}
                loading={this.props.loading}
                onBookmarkPress={(id) => { this._onBookmarkPress(id)} }
                bookmarks={this.props.bookmarks}
            />
        );                
    }

    toggleVideoOverlay(url) {
        this.props.navigation.navigate('VideoPlayerView', { embedUrl: url});
    }

    render(){
        let params = this.props.navigation.state.params;
        return(
            <Container>
                {this.displayClips()}
            </Container>    
        );
    }
}

const mapStateToProps = state => ({
    clips: state.userClips.clips,
    cursor: state.userClips.cursor,
    loading: state.userClips.loading,
    refreshing: state.userClips.refreshing,
    bookmarks: state.bookmarks.bookmarks,
});

export default connect(mapStateToProps)(UserClipsView);