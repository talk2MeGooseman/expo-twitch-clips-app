import React, { PureComponent } from 'react';
import { Text } from "native-base";
import PropTypes from "prop-types";

class EmptyListText extends PureComponent {
    static propsTypes = {
        loading: PropTypes.bool.isRequired,
        refreshing: PropTypes.bool,
    };

    render() {
        if (this.props.loading || this.props.refreshing) {
            return null;
        } else {
            return <Text style={{textAlign: 'center'}}>Nothing Here To See Move Along...</Text>;
        }
    }
}

export default EmptyListText;