import TwitchAPI from '../../lib/TwitchAPI';

export const FETCHING_USER_VIDEOS = 'FETCH_USER_VIDEOS';
export const USER_VIDEOS_RESPONSE  = 'USER_VIDEOS_RESPONSE';
export const REFRESH_USER_VIDEOS = 'REFRESH_USER_VIDEOS';

const fetchingUserVideos = (scope) => {
    return {
        type: FETCHING_USER_VIDEOS,
        scope
    }
}

export function fetchUsersVideos(channel_id, offset=0, scope='generic') {
    return async (dispatch, getstate) => {
        dispatch(fetchingUserVideos(scope));        
        dispatch(requestUserVideos(channel_id, offset, scope));
    }
}

function isRefreshingUserVideos(scope) {
    return {
        type: REFRESH_USER_VIDEOS,
        scope
    }
}

export function refreshUserVideos(channel_id, offset, scope='generic') {
    return async (dispatch, getstate) => {
        dispatch(isRefreshingUserVideos(scope));        
        dispatch(requestUserVideos(channel_id, offset, scope));
    }    
}

function recievedUserVideos(response, scope) {
    return {
        type: USER_VIDEOS_RESPONSE,
        videos: response.videos,
        total: response['_total'],
        scope
    };    
}

function requestUserVideos(channel_id, offset, scope) {
    return async (dispatch) => {
        let results = await TwitchAPI.v5getChannelVideos({channel_id: channel_id, offset: offset});
        dispatch(recievedUserVideos(results, scope));
    }
};