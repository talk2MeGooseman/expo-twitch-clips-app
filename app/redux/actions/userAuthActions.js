import TwitchAPI from '../../lib/TwitchAPI';

export const AUTH_USER = 'AUTH_USER';
export const USER_AUTHED = 'USER_AUTHED'

export const authUser = () => {
    return {
        type: AUTH_USER
    }
}

export const userAuthed = (loggedIn) => {
    return {
        type: USER_AUTHED,
        loggedIn,
    }
}

export function isUserAuthed() {
    return async (dispatch, getState) => {
        let loggedIn = await isUserLoggedIn(getState())
        return dispatch(userAuthed(loggedIn));
    }
}

export function authUserIfNeeded() {
    return async (dispatch, getState) => {
        let loggedIn = await isUserLoggedIn(getState())
        if (!loggedIn) {
            return dispatch(getToken());
        } else {
            return dispatch(userAuthed(true));
        }
    }
}

function getToken() {
    return (dispatch) => {
        dispatch(authUser());
        let twitchAPI = new TwitchAPI();
        twitchAPI.getUserAccessToken(dispatch);
    }
}

async function isUserLoggedIn() {
    let twitchAPI = new TwitchAPI();
    let loggedIn = await twitchAPI.tokenValid();
    
    return loggedIn;
}