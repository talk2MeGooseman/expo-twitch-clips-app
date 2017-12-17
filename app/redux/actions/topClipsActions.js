import TwitchAPI from '../../lib/TwitchAPI';

export const FETCHING_SUGGESTED_TOP_CLIPS = "FETCHING_SUGGESTED_TOP_CLIPS";
export const SUGGESTED_TOP_CLIPS_RESPONSE = "SUGGESTED_TOP_CLIP_RESPONSE";
export const SUGGESTED_TOP_CLIPS_COUNT = "SUGGESTED_TOP_CLIPS_COUNT"

export const FETCHING_TRENDING_CLIPS = "FETCHING_TRENDING_CLIPS";
export const TRENDING_CLIPS_RESPONSE = "TRENDING_CLIP_RESPONSE";
export const TRENDING_CLIPS_COUNT    = "TRENDING_CLIPS_COUNT";

function fetchingTrendingClips() {
    return {
        type: FETCHING_TRENDING_CLIPS
    }
}

export function setTrendingClipsCount(count) {
    return {
        type: TRENDING_CLIPS_COUNT,
        trending_count: count,
    }
}

function trendingClipsResponse(response) {
    return {
        type: TRENDING_CLIPS_RESPONSE,
        trending_clips: response.clips
    };
}

function requestTrendingClips(count) {
    return async (dispatch) => {
        let results = await TwitchAPI.getTopClipsForUser({ trending: true, count: count });
        dispatch(trendingClipsResponse(results));
    }
}

export function fetchTrendingClips(count) {
    return async (dispatch, getstate) => {
        dispatch(fetchingTrendingClips());        
        dispatch(requestTrendingClips(count));
    }
}

// SUGGESTED CLIPS ACTIONS ----------------------------------------------

export function fetchSuggestedTopClips(count) {
    return async (dispatch, getstate) => {
        dispatch(fetchingSuggestedTopClips());        
        dispatch(requestSuggestedTopClips(count));
    }
}

export function setSuggestedClipsCount(count) {
    return {
        type: SUGGESTED_TOP_CLIPS_COUNT,
        suggested_count: count,
    }
}

function fetchingSuggestedTopClips() {
    return {
        type: FETCHING_SUGGESTED_TOP_CLIPS
    }
}

function suggestedTopClipsResponse(result) {
    return {
        type: SUGGESTED_TOP_CLIPS_RESPONSE,
        top_clips: result.clips
    }
}

function requestSuggestedTopClips(count) {
    return async (dispatch) => {
      let results = await TwitchAPI.getTopClipsForUser({trending: false, count: count});
      dispatch(suggestedTopClipsResponse(results));
    }
}
