import TwitchAPI from '../../lib/TwitchAPI';

export const FETCHING_USER_CLIPS = 'FETCH_USER_CLIPS';
export const USER_CLIPS_RESPONSE  = 'USER_CLIPS_RESPONSE';
export const REFRESH_USER_CLIPS = 'REFRESH_USER_CLIPS';

export const fetchingUserClips = () => {
    return {
        type: FETCHING_USER_CLIPS
    }
}

export function fetchUsersClips(channel_name, cursor='') {
    return async (dispatch, getstate) => {
        dispatch(fetchingUserClips());        
        dispatch(requestUserClips(channel_name, cursor));
    }
}

function isRefreshingUserClips() {
    return {
        type: REFRESH_USER_CLIPS
    }
}

export function refreshUserClips(channel_name, cursor='') {
    return async (dispatch, getstate) => {
        dispatch(isRefreshingUserClips());        
        dispatch(requestUserClips(channel_name, cursor));
    }    
}

function recievedUserClips(response) {
    return {
        type: USER_CLIPS_RESPONSE,
        clips: response.clips,
        cursor: response['_cursor']
    };    
}

function requestUserClips(channel_name, cursor) {
    return async (dispatch) => {
        let response = await TwitchAPI.v5getTopClips({ channel_name: channel_name, cursor: cursor });
        dispatch(recievedUserClips(response));
    }
};