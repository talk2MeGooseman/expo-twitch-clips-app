import {
  Linking,
  AsyncStorage
} from 'react-native';
import {
  userAuthed,
} from '../redux/actions/userAuthActions'
import CONSTANTS from './Constants';
import {CLIENT_ID} from './secrets';
import {
  Constants,
  WebBrowser
} from 'expo';

const TWITCH_ACCEPT = "application/vnd.twitchtv.v5+json";
const REDIRECT_URI = Constants.linkingUri;
const SCOPES = 'collections_edit user_follows_edit user_subscriptions user_read user_subscriptions';
const V5_TWITCH_BASE_URL = "https://api.twitch.tv/kraken";

export default class TwitchAPI {
  constructor() {
    this.access_token = null;
  }

  async getUserAccessToken(dispatch) {
    const url = `${V5_TWITCH_BASE_URL}/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&force_verify=true`;
    Linking.addEventListener('url', (event) => { this.browserCallback(event, dispatch) });
    await WebBrowser.openBrowserAsync(encodeURI(url));
    Linking.removeListener('url', (event) => { this.browserCallback(event, dispatch) });
  }

  async browserCallback(event, dispatch) {
    WebBrowser.dismissBrowser();
    console.log(event);
    const access_token = event.url.toString().match(/access_token=([^&]+)/);
    let valid = false;
    // Check for issue with Kindle Fire Tablet
    if (Array.isArray(access_token) && access_token.length === 2) {
      this.access_token = access_token[1];
      AsyncStorage.setItem('TWITCH:ACCESS_TOKEN:key', this.access_token);
      valid = await this.tokenValid();
    } else if (access_token) {
      this.access_token = access_token;
      AsyncStorage.setItem('TWITCH:ACCESS_TOKEN:key', this.access_token);
      valid = await this.tokenValid();
    } else {
      valid = false;
    }

    dispatch(userAuthed(valid));
  }

  async tokenValid(token) {
    try {
      if (!token) {
        token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
      }
      const response = await fetch(`${V5_TWITCH_BASE_URL}?oauth_token=${token}`, {
        method: 'GET',
        headers: {
          "client-id": CLIENT_ID,
          "accept": TWITCH_ACCEPT
        }
      });

      result = await response.json();

      if (result.token.user_id) {
        AsyncStorage.setItem('TWITCH:USER_INFO:key', JSON.stringify(result.token));
      }

    } catch (error) {
      console.log('Request Error: access_token', token, error)
      result = false;
    }
    return result.token.valid;
  }

  static async getTopClipsForUser({
    trending,
    cursor = "",
    count = 25
  }) {
    let result = {};
    let token = null;
    try {
      token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
      const response = await fetch(`${V5_TWITCH_BASE_URL}/clips/followed?limit=${count}&trending=${trending}`, {
        method: 'GET',
        headers: {
          "Client-ID": CLIENT_ID,
          "Authorization": `OAuth ${token}`,
          "Accept": TWITCH_ACCEPT,
          'Content-Type': 'application/json',
        }
      });

      result = await response.json();

      if (response.status === 401) throw result.message;
    } catch (error) {
      console.log('Request Error: access_token', token, error)
      result = false;
    }
    return result;
  }

  static async v5fetchUsersInfo(user_id) {
    const response = await fetch(`${V5_TWITCH_BASE_URL}/channels/${user_id}`, {
      method: 'GET',
      headers: {
        "client-id": CLIENT_ID,
        "accept": TWITCH_ACCEPT
      }
    });

    let result = await response.json();

    return result;
  }

  static async v5getChannelFollowers(channel_id, cursor = '') {
    const response = await fetch(`${V5_TWITCH_BASE_URL}/channels/${channel_id}/follows?limit=100&cursor=${cursor}`, {
      method: 'GET',
      headers: {
        "client-id": CLIENT_ID,
        "accept": TWITCH_ACCEPT
      }
    });

    let result = await response.json();

    return (result);
  }

  static async v5getUsersFollow(offset = 0) {
    let userInfo = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
    let {
      user_id
    } = JSON.parse(userInfo);
    const response = await fetch(`${V5_TWITCH_BASE_URL}/users/${user_id}/follows/channels?limit=100&offset=${offset}`, {
      method: 'GET',
      headers: {
        "client-id": CLIENT_ID,
        "accept": TWITCH_ACCEPT
      }
    });

    let result = await response.json();
    console.log(result);
    return (result);
  }

  static async v5getTopClips({
    channel_name,
    period = 'month',
    cursor = ''
  }) {
    let userInfo = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
    let {
      user_id
    } = JSON.parse(userInfo);
    const response = await fetch(`${V5_TWITCH_BASE_URL}/clips/top?channel=${channel_name}&limit=25&period=${period}&cursor=${cursor}`, {
      method: 'GET',
      headers: {
        "client-id": CLIENT_ID,
        "accept": TWITCH_ACCEPT
      }
    });

    let result = await response.json();
    if (result.status === 400) {
      alert('Sorry Something Went Wrong :(');
    }
    return (result);
  }

  static async v5getChannelVideos({
    channel_id,
    sort = 'time ',
    offset = 0
  }) {
    const response = await fetch(`${V5_TWITCH_BASE_URL}/channels/${channel_id}/videos?limit=25&offset=${offset}`, {
      method: 'GET',
      headers: {
        "client-id": CLIENT_ID,
        "accept": TWITCH_ACCEPT
      }
    });

    let result = await response.json();

    return (result);
  }

  static async v5getFollowedStreams(filterBy) {
    let totalResults = [];
    let result;
    let token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
    let type;

    switch (filterBy) {
      case CONSTANTS.LIVE_INDEX:
        type = 'live';
        break;
      case CONSTANTS.VOD_INDEX:
        type = 'playlist';
        break;
      default:
        type = 'all';
        break;
    }

    do {
      const response = await fetch(`${V5_TWITCH_BASE_URL}/streams/followed?limit=100&stream_type=${type}&offset=${totalResults.length}`, {
        method: 'GET',
        headers: {
          "client-id": CLIENT_ID,
          "accept": TWITCH_ACCEPT,
          "Authorization": `OAuth ${token}`,
        }
      });
      result = await response.json();
      totalResults = totalResults.concat(result.streams);
    } while (result._total > totalResults.length)

    return (totalResults);
  }

  static async fetchLiveUsers(user_ids) {
    const params = user_ids.map((user_id) => `user_id=${user_id}`);

    const response = await fetch(`https://api.twitch.tv/helix/streams?${params.join('&')}&type%20=live&first=100`, {
      method: 'GET',
      headers: {
        "client-id": CLIENT_ID,
      }
    });

    let result = await response.json();

    return (result.data);
  }

  static async fetchVodcastUsers(user_ids) {
    const params = user_ids.map((user_id) => `user_id=${user_id}`);

    const response = await fetch(`https://api.twitch.tv/helix/streams?${params.join('&')}&type=vodcast&first=100`, {
      method: 'GET',
      headers: {
        "client-id": CLIENT_ID,
      }
    });

    let result = await response.json();

    return (result.data);
  }

  static async getUsersFollow(user_id) {
    const response = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=${user_id}&first=100`, {
      method: 'GET',
      headers: {
        "client-id": CLIENT_ID,
      }
    });

    let result = await response.json();

    const followed = result.data.map((item) => {
      return item.to_id;
    });

    return (followed);
  }

  static async currentUserInfo() {
    let token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
    const response = await fetch(`https://api.twitch.tv/helix/users`, {
      method: 'GET',
      headers: {
        "client-id": CLIENT_ID,
        "Authorization": `Bearer ${token}`,
      }
    });

    let result = await response.json();

    return result.data;
  }
}