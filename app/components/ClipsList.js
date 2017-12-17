import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  StyleSheet,
  LayoutAnimation,
  ActivityIndicator,
  Platform,
  FlatList
} from 'react-native';
import { 
  Content,
  Text,
} from 'native-base';
import ClipCard from '../components/ClipCard';
import TwitchAPI from '../lib/TwitchAPI';

export default class ClipsList extends Component {
    static propTypes = {
        toggleOverlay: PropTypes.func.isRequired,
        onBookmarkPress: PropTypes.func.isRequired,
        onFetchNextPage: PropTypes.func,
        onRefresh: PropTypes.func,
        data: PropTypes.array,
        loading: PropTypes.bool,
        refreshing: PropTypes.bool,
        bookmarks: PropTypes.object,
    };

    endReached = () => {
        if(this.props.loading) return;
        if(this.props.onFetchNextPage) {
            this.props.onFetchNextPage();
        } else {
            return false;
        }
    }

    addClip({item: video}) {
        let bookmarked = false;
        if (this.props.bookmarks) {
            const bookmarks = this.props.bookmarks;
            bookmarked = bookmarks[video.tracking_id] ? true : false;
        }

        const passProps = {
            username: video.broadcaster.display_name,
            id: video.tracking_id,
            user_id: video.broadcaster.id,
            image_url: video.thumbnails.medium,
            views: video.views,
            duration: video.duration,
            game_title: video.game,
            created_at: video.created_at,
            url: video.url,
            embed_url: video.embed_url,
            title: video.title,
            onImagePress: this.props.toggleOverlay,
            onBookmarkPress: this.props.onBookmarkPress,
            broadcast_type: 'highlight',
            bookmarked: bookmarked,
        };

        return <ClipCard { ...passProps } />;
    }

    renderActivityIndicator = () => {
        let comp = null;
        if (this.props.loading) {
            comp = <ActivityIndicator color="black" size="large" style={ styles.spinner } />
        } 
        return comp;
    }

    renderEmptyList = () => {
        if (this.props.loading || this.props.refreshing) {
            return null;
        } else {
            return <Text style={{textAlign: 'center'}}>Nothing Here To See Move Along...</Text>;
        }
    }

    renderHeader = () => {
        if(this.props.renderHeader) {
            return this.props.renderHeader();
        } else {
            return false;
        }
    }

    onRefresh = () => {
        if(this.props.onRefresh) {
            this.props.onRefresh();
        } else {
            return false
        }
    }

    render(){
        return(
            <FlatList
                style={styles.content}
                data={this.props.data}
                renderItem={(item) => this.addClip(item) }
                keyExtractor={(item) => item.tracking_id}
                onEndReached={this.endReached}
                onEndReachedThreshold={0.80}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderActivityIndicator}
                ListEmptyComponent={this.renderEmptyList}
                onRefresh={this.onRefresh}
                refreshing={this.props.refreshing}
                extraData={this.props.bookmarks}
            />            
        );  
    }
};

const styles = StyleSheet.create({
    content: {
      backgroundColor: 'gray',
    },
    spinner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: "center"
    },
    noClipsText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    }
});