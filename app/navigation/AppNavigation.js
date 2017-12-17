import { StackNavigator, DrawerNavigator, TabNavigator, TabBarTop } from 'react-navigation';
import TrendingClipsView from '../views/TrendingClipsView';
import PopularClipsView from '../views/PopularClipsView';
import SplashScreen from '../views/SplashScreenView';
import FollowingView from '../views/FollowingView';
import UserClipsView from '../views/UserClipsView';
import UserVideosView from '../views/UserVideosView';
import VideoPlayerView from '../views/VideoPlayerView';
import NativeBaseTheme from '../../native-base-theme/variables/platform';
import UserStuffView from '../views/UserStuffView';
import ChannelFollowersView from '../views/ChannelFollowersView';
import ChannelVideosView from '../views/ChannelVideosView';
import LoggingOutView from '../views/LoggingOutView';
import FavoritesView from '../views/FavoritesView';

// Tab View for Users 
const UserViewTabNav = TabNavigator({
  UserClips: { screen: UserClipsView },
  UserVideos: { screen: UserVideosView},
}, {
  tabBarComponent: TabBarTop,
  tabBarPosition: 'top',
  animationEnabled: true,
  lazy: true,
  backBehavior: 'none',
  tabBarOptions: {
    indicatorStyle: {
      backgroundColor: 'white'
    }, 
    labelStyle: {
      fontSize: NativeBaseTheme.tabFontSize,
      fontWeight: 'bold'
    },
    style: {
      backgroundColor: NativeBaseTheme.brandPrimary,
    },
  },
});

// Following Stack
const FollowingStack = StackNavigator({
  FollowingView: { screen: FollowingView },
  UserView: { screen: UserViewTabNav },
}, {
  initialRouteName: 'FollowingView',
  mode: 'card',
  headerMode: 'screen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: NativeBaseTheme.brandPrimary
    },
    headerTitleStyle: {
      color: 'white'
    },
    headerBackTitleStyle: {
      color: 'white'
    }
  }
});

// Tab View for Clips
const ClipsViewTabNav = TabNavigator({
  TrendingClipsView: { screen: TrendingClipsView},
  PopularClipsView: { screen: PopularClipsView},
}, {
  tabBarComponent: TabBarTop,
  tabBarPosition: 'top',
  animationEnabled: true,
  lazy: true,
  backBehavior: 'none',
  tabBarOptions: {
    indicatorStyle: {
      backgroundColor: 'white'
    }, 
    labelStyle: {
      fontSize: NativeBaseTheme.tabFontSize,
      fontWeight: 'bold'
    },
    style: {
      backgroundColor: NativeBaseTheme.brandPrimary,
    },
  },
});

// Following Stack
const TopClipsStack = StackNavigator({
  ClipsViewTabNav : { screen: ClipsViewTabNav },
}, {
  mode: 'card',
  headerMode: 'screen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: NativeBaseTheme.brandPrimary
    },
    headerTitleStyle: {
      color: 'white'
    },
    headerBackTitleStyle: {
      color: 'white'
    }
  }
});

const UserStuffStack = StackNavigator({
  UserStuffView: { screen: UserStuffView},
  ChannelFollowersView: { screen: ChannelFollowersView},
  ChannelVideosView: { screen: ChannelVideosView },
  ChannelClipsView: { screen: UserClipsView },
}, {
    mode: 'card',
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: NativeBaseTheme.brandPrimary
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerBackTitleStyle: {
        color: 'white'
      }
    }
});

const FavoritesStack = StackNavigator({
  FavoritesView: { screen: FavoritesView},
}, {
    mode: 'card',
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: NativeBaseTheme.brandPrimary
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerBackTitleStyle: {
        color: 'white'
      }
    }
});

// Drawer stack
const DrawerStack = DrawerNavigator({
  TopClipsStack: { screen: TopClipsStack},
  FollowingStack: { screen: FollowingStack },
  UserStuffStack: { screen: UserStuffStack},
  FavoritesStack: { screen: FavoritesStack },
  LogOut: { screen: LoggingOutView },
});

// Root Stack
const PrimaryNav = StackNavigator({
    SplashScreen: { screen: SplashScreen},
    DrawerStack: { screen: DrawerStack },
    VideoPlayerView: { screen: VideoPlayerView },
  }, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'SplashScreen'
});

export default PrimaryNav;