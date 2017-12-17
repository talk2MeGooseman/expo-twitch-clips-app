import React, {
    Component
} from 'react';
import PropTypes from "prop-types";
import {
    View,
    TouchableOpacity,
    AsyncStorage,
    Image,
    Dimensions,
    StyleSheet,
    ActivityIndicator,
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
    Card,
    CardItem,
} from 'native-base';
import TwitchAPI from '../lib/TwitchAPI';
import {
    connect
} from "react-redux";
import {
    requestUserInfo,
    requestUsersFollowers
} from "../redux/actions/userStuffAction";
import { fetchUsersVideos } from "../redux/actions/userVideoActions";

const { height, width } = Dimensions.get('window');

class UserStuffView extends Component {
    static propTypes = ({
        titleImage: PropTypes.string,
        followersCount: PropTypes.number,
        loadingFollowers: PropTypes.bool,
        loadingVideos: PropTypes.bool,
        videosCount: PropTypes.number,
    });

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            drawerLabel: 'Your Channel',
            title: 'You Channel',
            headerTitle: <Title>{params.username}</Title>,
            headerLeft: <Button onPress={() => { navigation.navigate('DrawerOpen'); }}><Icon name="menu" /></Button>,
        };
    };

    _onFollowersPress = () => {
        this.props.navigation.navigate('ChannelFollowersView');
    }

    _onVideosPress = () => {
        this.props.navigation.navigate('ChannelVideosView');
    }

    _onClipsPress = () => {
        this.props.navigation.navigate('ChannelClipsView', {
            display_name: this.props.navigation.state.params.username
        });
    }

    componentDidMount(){
        this._setTitleBarName();
        this._getUserInfo();
        this._getChannelInfo();
    }

    componentDidUpdate(){
    }

    async _setTitleBarName() {
        let result = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
        let userInfo = JSON.parse(result);
        const {setParams} = this.props.navigation;    
        setParams({username: userInfo.user_name });
    }

    _getUserInfo() {
        let image = "http://demo.bestdnnskins.com/portals/6/innerpage/banner3_04.jpg";
        const { dispatch } = this.props.navigation;
        dispatch(requestUserInfo());
    }

    async _getChannelInfo() {
        let result = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
        let userInfo = JSON.parse(result);

        // 1. Get channel info for follower count
        const { dispatch } = this.props.navigation;
        if(!this.props.followersCount) {
            dispatch(requestUsersFollowers(userInfo.user_id));
        }
        // 2. Get channel videos for video count
        if (!this.props.videosCount) {
            dispatch(fetchUsersVideos(userInfo.user_id, 0,'current'));
        }
    }

    _displayFollowerCount() {
        if(this.props.loadingFollowers) {
            return this._renderSpinner();
        } else if (this.props.followersCount) {
            return <Text style={styles.counterTextStyle}>{this.props.followersCount}</Text>;
        } else {
            return <Text>"?"</Text>;
        }
    }

    _displayVideoCount() {
        if(this.props.loadingVideos) {
            return this._renderSpinner();
        } else if (this.props.videosCount) {
            return <Text style={styles.counterTextStyle}>{this.props.videosCount}</Text>;
        } else {
            return <Text>"?"</Text>;
        }
    }

    _renderSpinner(){
        return <ActivityIndicator style={{ alignSelf: 'center' }} color="purple" size="small" />
    }

    render() {
        return (
            <Container>
                <Content>
                    <Image style={styles.twitchBackgroundImage} source={require('../assets/twitch-bg.jpg')}>
                        <Image style={styles.titleImage} source={{ uri: this.props.titleImage }} />
                    </Image>
                    <View style={ { flexDirection: 'row' } }>
                        <Card style={ styles.cardStyles }>
                            <TouchableOpacity onPress={this._onFollowersPress}>
                                <CardItem>
                                    <Body>
                                        <Text style={ styles.titleTextStyles }>
                                            Followers
                                        </Text>
                                        {this._displayFollowerCount()}
                                    </Body>
                                </CardItem>
                            </TouchableOpacity>
                        </Card>
                        <Card style={ styles.cardStyles }>
                            <TouchableOpacity onPress={this._onClipsPress}>
                                <CardItem>
                                    <Body>
                                        <Text style={ styles.titleTextStyles }>
                                            Clips
                                        </Text>
                                        <Icon name="md-cut" style={ styles.counterTextStyle } />
                                    </Body>
                                </CardItem>
                            </TouchableOpacity>
                        </Card>
                        <Card style={ styles.cardStyles }>
                            <TouchableOpacity onPress={this._onVideosPress}>
                                <CardItem>
                                    <Body>
                                        <Text style={ styles.titleTextStyles }>
                                            Videos
                                        </Text>
                                        {this._displayVideoCount()}
                                    </Body>
                                </CardItem>
                            </TouchableOpacity>
                        </Card>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    cardStyles: {
        flex: 1,
        alignSelf: 'center',
        height: 90,
    },
    titleTextStyles: {
        alignSelf: 'center',
        fontSize: 20
    },
    counterTextStyle: {
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    twitchBackgroundImage: {
        width: '100%',
        height: height * .30,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleImage: {
        width: 100,
        height: 100
    }
});

const mapStateToProps = (state) => ({
    titleImage: state.userStuff.userInfo.profile_image_url,
    followersCount: state.userStuff.totalFollowers,
    loadingFollowers: state.userStuff.loadingFollowers,
    loadingVideos: state.currentUserVideos.loading,
    videosCount: state.currentUserVideos.total,
});

export default connect(mapStateToProps)(UserStuffView)