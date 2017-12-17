import React, {
    Component
} from 'react';
import {
    FlatList,
    AsyncStorage,
} from 'react-native';
import {
    Container,
    Title,
    Button,
    Icon,
    Header,
    Left,
    Body,
    Right,
    Text,
    Content,
    Thumbnail,
    ListItem
} from 'native-base';
import UserListCell from "../components/UserListCell";
import ListFooter from "../components/ListFooter";
import EmptyListText from "../components/EmptyListText";
import { connect } from "react-redux";
import { requestUsersFollowers } from "../redux/actions/userStuffAction";

class ChannelFollowersView extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params;
        return {
            title: 'Followers',
            headerTitle: <Title>Followers</Title>,
        };
    };

    componentDidMount(){
    }

    async _getChannelFollowers() {
        if (this.props.loading || this.props.total === this.props.followers.length) return;

        let result = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
        let userInfo = JSON.parse(result);
        // Dispatch for followers
        const { dispatch } = this.props.navigation;
        dispatch(requestUsersFollowers(userInfo.user_id, this.props.cursor)); 
    }

    _renderRow({ user, created_at }) {
        const date = new Date(created_at);
        return(
            <ListItem avatar>
                <Left>
                    <Thumbnail source={{ uri: user.logo }} />
                </Left>
                <Body>
                    <Text>{user.display_name}</Text>
                    <Text note>Since: {date.toLocaleDateString()}</Text>
                </Body>
                <Right>
                </Right>
            </ListItem>
        );
    }

    _renderFooter = () => {
        return <ListFooter loading={this.props.loading} />
    }

    _renderEmptyList = () => {
        return <EmptyListText loading={this.props.loading} />
    }

    render() {
        return (
            <Container>
                <FlatList
                    style={{ backgroundColor: 'white' }}
                    data={this.props.followers}
                    renderItem={({ item: user }) => this._renderRow(user)}
                    keyExtractor={({user}) => user._id}
                    onEndReached={() => this._getChannelFollowers() }
                    onEndReachedThreshold={0.75}
                    ListFooterComponent={this._renderFooter()}
                    ListEmptyComponent={this._renderEmptyList()}
                    // onRefresh={this.onRefresh}
                    // refreshing={this.props.refreshing}
                />
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    followers: state.userStuff.follows,
    total: state.userStuff.totalFollowers,
    cursor: state.userStuff.followCursor,
    loading: state.userStuff.loadingFollowers,
});

export default connect(mapStateToProps)(ChannelFollowersView);