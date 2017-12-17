import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import { Spinner } from "native-base";

class ListFooter extends PureComponent {
    static propTypes = {
        loading: PropTypes.bool.isRequired
    };

    render() {
        if (this.props.loading) {
            return(<Spinner color='black'/>);
        } else {
            return null;
        }   
    }
}

export default ListFooter;