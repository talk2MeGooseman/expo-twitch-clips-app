export const ADD_BOOKMARK = 'ADD_BOOKMARK';
export const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK';
export const INIT_BOOKMARKS = 'INIT_BOOKMARKS';

export function addBookmark(data) {
    return {
        type: ADD_BOOKMARK,
        data
    }
}

export function removeBookmark(data) {
    return {
        type: REMOVE_BOOKMARK,
        data
    }
}

export function initBookmarks(bookmarks) {
    return {
        type: INIT_BOOKMARKS,
        bookmarks
    }
}