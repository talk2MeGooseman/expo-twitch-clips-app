import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
} from 'react-native';
import { Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

const MILISECONDS_IN_MINUTE = 60000;
const BOOKMARKABLE = ['highlight', 'upload'];

export default class ClipCard extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    views: PropTypes.number.isRequired,
    game_title: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    embed_url: PropTypes.string,
    broadcast_type: PropTypes.string,
    bookmarked: PropTypes.bool,
    onImagePress: PropTypes.func.isRequired,
    onBookmarkPress: PropTypes.func.isRequired,
  };

  _formatVideoDuration(seconds) {
    if (seconds < 60) {
      return `${Math.round(seconds)} secs`;
    } else {
      return `${Math.round(seconds/60)} mins`;
    }
  }

  _displayBookmark() {
    if(this.props.bookmarked) {
      return <Icon active name="md-heart" style={ styles.icon } />
    } else {
      return <Icon active name="md-heart-outline" style={ styles.icon } />
    }
  }

  _onBookmarkPress = () => {
    this.props.onBookmarkPress(this.props.id);
  }

  _displayBookmarkSection() {
    if(BOOKMARKABLE.includes(this.props.broadcast_type)) {
      return (
        <Body>
          <Button transparent style={ {alignSelf: 'center'} } onPress={ this._onBookmarkPress }>
            {this._displayBookmark()}
          </Button>
        </Body>
      );
    }

    return null;
  }

  createFooter() {
    return (
      <CardItem>
        <Left>
          <Button transparent>
            <Icon active name="people" />
            <Text>{this.props.views} Views</Text>
          </Button>
        </Left>
        {this._displayBookmarkSection()}
        <Right>
          <Button transparent>
            <Icon active name="timer" />
            <Text>{this._formatVideoDuration(this.props.duration)}</Text>
          </Button>
        </Right>
      </CardItem>
    );
  }

  createHeaderInformation() {
    let jsxElements = [];
    jsxElements.push(<Text key="1" >{this.props.title}</Text>);
    jsxElements.push(<Text note key="2">{this.props.username}</Text>);    
    jsxElements.push(<Text note key="3">{this.props.game_title}</Text>);
    return jsxElements;
  }

  render() {
    const { image_url } = this.props;
    return (
      <Card>
        <CardItem>
          <Body>
            { this.createHeaderInformation() }
          </Body>
        </CardItem>
        <CardItem cardBody>
          <Content>
            <Button style={{ height: 272, width: null,}} transparent onPress={ () => this.props.onImagePress(this.props.embed_url || this.props.url) }>
              <Image source={ {uri: image_url} } style={{ height: 272, width: null, flex: 1 }} />
            </Button>
          </Content>
        </CardItem>
        { this.createFooter() }
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    color: 'red',
  }  
});