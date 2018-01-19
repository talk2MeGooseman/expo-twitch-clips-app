export const buildParams = (params) => {
    return params.join('&');
}

export function toQueryString(params) {
    return '?' + Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
}

export const getRequest = (url, params, header) => {
    const bParams = buildParams(params);
    const requestURL = [url, bParams].join('?');

    return fetch(requestURL, {
        method: 'GET',
        headers: new Headers(header)
    });
}