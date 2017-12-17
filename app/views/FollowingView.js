import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Title, Body, Spinner, Container, Text, Left, Button, Icon, Right, ActionSheet, Thumbnail, ListItem } from 'native-base';
import CONSTANTS from '../lib/Constants';
import { connect } from 'react-redux';
import { fetchFollowing, refreshFollowing, filterFollowing } from '../redux/actions/followActions';
import UserListCell from '../components/UserListCell';

class FollowingView extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params;
        return {
            drawerLabel: 'Following',
            title: 'Following',
            headerTitle: <Title>Following</Title>,
            headerLeft: <Button onPress={() => { navigation.navigate('DrawerOpen'); }}><Icon name="menu" /></Button>,
        };
    };

    componentDidMount() {
        const { dispatch, setParams } = this.props.navigation;
        dispatch(fetchFollowing());
    }

    componentDidUpdate(prevProps, prevState) {
    }

    navigateUserView = (data) => {
        this.props.navigation.navigate('UserView', data);
    }

    renderChannel(channelInfo) {

        return (
            <UserListCell
                onPress={this.navigateUserView}
                channel={channelInfo.channel}
            />
        );
    }

    renderFooter = () => {
        if (this.props.loading) {
            return (<Spinner color='black' />);
        } else {
            return null;
        }
    }

    renderEmptyList = () => {
        if (this.props.loading || this.props.refreshing) {
            return null;
        } else {
            return <Text style={{ textAlign: 'center' }}>Nothing Here To See Move Along...</Text>;
        }
    }

    onRefresh = () => {
        const { dispatch } = this.props.navigation;
        dispatch(refreshFollowing());
    }

    render() {
        return (
            <Container>
                <FlatList
                    style={{ backgroundColor: 'white' }}
                    data={this.props.following}
                    renderItem={({ item: channel }) => this.renderChannel(channel)}
                    keyExtractor={(channel) => channel.channel._id}
                    onEndReached={() => { }}
                    onEndReachedThreshold={0.75}
                    ListFooterComponent={this.renderFooter()}
                    ListEmptyComponent={this.renderEmptyList()}
                    onRefresh={this.onRefresh}
                    refreshing={this.props.refreshing}
                />
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    following: state.userFollowing.following,
    total: state.userFollowing.total,
    loading: state.userFollowing.loading,
    refreshing: state.userFollowing.refreshing,
});

export default connect(mapStateToProps)(FollowingView);