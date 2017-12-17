import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    ListItem,
    Thumbnail,
    Left,
    Body,
    Text,
    Right
} from "native-base";

export default class UserListCell extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        channel: PropTypes.object.isRequired,
    };

    render(){
        const { onPress, channel } = this.props;
        let image_url = channel.logo || "http://via.placeholder.com/300x533?text=?";

        return (
            <ListItem avatar onPress={() => onPress(channel)}>
                <Left>
                    <Thumbnail source={{ uri: image_url }} />
                </Left>
                <Body>
                    <Text>{channel.display_name}</Text>
                    <Text note>{channel.status}</Text>
                    <Text note>Followers: {channel.followers}</Text>
                </Body>
                <Right />
            </ListItem>
        );
    }
}