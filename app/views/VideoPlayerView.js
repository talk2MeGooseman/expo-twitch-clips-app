import React, { PureComponent } from 'react';
import WebViewOverlay from '../components/WebViewOverlay';

class VideoPlayerView extends PureComponent {
    render() {
        const { embedUrl } = this.props.navigation.state.params;
        const { goBack } = this.props.navigation;
        return <WebViewOverlay url={embedUrl} closePlayer={goBack} />;
    }
}

export default VideoPlayerView;