import { WebBrowser } from 'expo';

export default async function openURL(url) {
    await WebBrowser.openBrowserAsync(url);
    return;
}
