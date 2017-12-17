import TwitchAPI from '../../lib/TwitchAPI';

export const FETCHING_FOLLOWING = 'FETCHING_FOLLOWING';
export const FOLLOWING_RESPONSE = 'FOLLOWING_RESPONSE';
export const REFRESH_FOLLOWING = 'REFRESH_FOLLOWING';
export const FILTER_FOLLOWING = 'FILTER_FOLLOWING';


export const fetchingFollowing = () => {
    return {
        type: FETCHING_FOLLOWING
    }
}

export const refreshFollowing = () => {
    return async (dispatch, getState) => {
        dispatch(refreshingFollowing());
        dispatch(requestFollowing());
    }
}

export function fetchFollowing() {
    return async (dispatch, getState) => {
        dispatch(fetchingFollowing());        
        dispatch(requestFollowing());
    }
} 

function refreshingFollowing() {
    return {
        type: REFRESH_FOLLOWING
    }
}

function receiveFollowing(response) {
    return {
      type: FOLLOWING_RESPONSE,
      following: response.follows,
      total: response._total,
    }
}

function requestFollowing() {
    return async (dispatch) => {
        let response = await TwitchAPI.v5getUsersFollow();
        dispatch(receiveFollowing(response));
    }
}