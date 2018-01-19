import {
  Linking,
  AsyncStorage
} from 'react-native';
import {
  userAuthed,
} from '../redux/actions/userAuthActions'
import CONSTANTS from './Constants';
import {
  Constants,
  AuthSession,
} from 'expo';
import { buildParams, getRequest, toQueryString } from "./apiUtils";

const CLIENT_ID = 'imgxjm3xjyq0kupk8ln0s11b3bpu1x';
const V5_TWITCH_ACCEPT = "application/vnd.twitchtv.v5+json";
const REDIRECT_URI = Constants.linkingUri;
const SCOPES = 'collections_edit user_follows_edit user_subscriptions user_read user_subscriptions';
const V5_TWITCH_BASE_URL = "https://api.twitch.tv/kraken";

const BASE_HEADER = {
  "client-id": CLIENT_ID
};

const V5_HEADER = {
  ...BASE_HEADER,
  "accept": V5_TWITCH_ACCEPT,
  'Content-Type': 'application/json',
};

export default class TwitchAPI {
  constructor() {
    this.access_token = null;
  }

  getUserAccessToken = async (dispatch) => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl: `${V5_TWITCH_BASE_URL}/oauth2/authorize` + toQueryString({
        client_id: CLIENT_ID,
        response_type: 'token',
        scope: SCOPES,
        redirect_uri: redirectUrl,
      }),
    });

    if (result.type === 'success') {
      this.browserCallback(result, dispatch);
    }
  }

  async browserCallback(event, dispatch) {
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

      let params = [`oauth_token=${token}`];
      const response = await getRequest(V5_TWITCH_BASE_URL, params, V5_HEADER);
      result = await response.json();

      if (result.token.user_id) {
        AsyncStorage.setItem('TWITCH:USER_INFO:key', JSON.stringify(result.token));
      }

    } catch (error) {
      console.log('Request Error: access_token', token, error)
      return false;
    }
    return result.token.valid;
  }

  static async topClips({period = 'week', trending = true, cursor=''}) {
    const url = `${V5_TWITCH_BASE_URL}/clips/top`;
    let params = [`limit=100`, `cursor=${cursor}`, `period=${period}`, `trending=${trending}`];

    const response = await getRequest(url, params, V5_HEADER);
    let result = await response.json();

    return result;
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

      const url = `${V5_TWITCH_BASE_URL}/clips/followed`;
      let params = [`limit=${count}`, `trending=${trending}`];
      const header = {
        ...V5_TWITCH_ACCEPT,
        "Authorization": `OAuth ${token}`,
      };

      const response = await getRequest(url, params, header);
      result = await response.json();

      if (response.status === 401) throw result.message;
    } catch (error) {
      console.log('Request Error:', error)
      result = false;
    }

    return result;
  }

  static async v5fetchUsersInfo(user_id) {
    const url = `${V5_TWITCH_BASE_URL}/channels/${user_id}`;

    const response = await getRequest(url, [], V5_HEADER);
    let result = await response.json();

    return result;
  }

  static async v5getChannelFollowers(channel_id, cursor = '') {
    const url = `${V5_TWITCH_BASE_URL}/channels/${channel_id}/follows`;
    let params = [`limit=100`, `cursor=${cursor}`];

    const response = await getRequest(url, params, V5_HEADER);
    let result = await response.json();

    return (result);
  }

  static async v5getUsersFollow(offset = 0) {
    let userInfo = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
    let {
      user_id
    } = JSON.parse(userInfo);
    
    const url = `${V5_TWITCH_BASE_URL}/users/${user_id}/follows/channels`;
    let params = ['limit=100', `offset=${offset}`];

    const response = await getRequest(url, params, V5_HEADER);
    let result = await response.json();

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
    const url = `${V5_TWITCH_BASE_URL}/clips/top`;
    let params = [`channel=${channel_name}`, 'limit=25', `period=${period}`, `cursor=${cursor}`];
   
    const response = await getRequest(url, params, V5_HEADER);

    let result = await response.json();

    return (result);
  }

  static async v5getChannelVideos({
    channel_id,
    sort = 'time ',
    offset = 0
  }) {
    const url = `${V5_TWITCH_BASE_URL}/channels/${channel_id}/videos`;
    let params = ['limit=25', `offset=${offset}`];

    const response = await getRequest(url, params, V5_HEADER);

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
      const url = `${V5_TWITCH_BASE_URL}/streams/followed`;
      let params = ['limit=100', `stream_type=${type}`, `offset=${totalResults.length}`];
      const headers = {
        ...V5_HEADER,
        "Authorization": `OAuth ${token}`,
      };

      const response = await getRequest(url, params, headers);
      result = await response.json();

      totalResults = totalResults.concat(result.streams);
    } while (result._total > totalResults.length)

    return (totalResults);
  }

  static async fetchLiveUsers(user_ids) {
    let params = user_ids.map((user_id) => `user_id=${user_id}`);
    params = params.concat(['type%20=live', 'first=100']);

    const url = `https://api.twitch.tv/helix/streams`;
    const response = await getRequest(url, params, BASE_HEADER);

    let result = await response.json();

    return (result.data);
  }

  static async fetchVodcastUsers(user_ids) {
    let params = user_ids.map((user_id) => `user_id=${user_id}`);

    params = params.concat(['type=vodcast', 'first=100']);
    const url = `https://api.twitch.tv/helix/streams`;
    const response = await getRequest(url, params, BASE_HEADER);

    let result = await response.json();

    return (result.data);
  }

  static async getUsersFollow(user_id) {
    const url = `https://api.twitch.tv/helix/users/follows`;
    let params = [`from_id=${user_id}`, `first=100`];
    const response = await getRequest(url, params, BASE_HEADER);

    let result = await response.json();

    const followed = result.data.map((item) => {
      return item.to_id;
    });

    return (followed);
  }

  static async currentUserInfo() {
    let token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
    const url = `https://api.twitch.tv/helix/users`;
    const headers = {
      ...BASE_HEADER,
      "Authorization": `Bearer ${token}`
    };
    const response = await getRequest(url, [], headers);

    let result = await response.json();

    return result.data;
  }
}