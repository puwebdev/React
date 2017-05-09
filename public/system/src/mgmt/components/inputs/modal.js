import React, { Component, PropTypes } from 'react';

export class Modal extends Component {
    static propTypes = {
        children: PropTypes.node
    }

    render() {
        return(
            <div className={`transparent-layer ${this.props.className || ""}`}>
                {this.props.children}
            </div>
        )
    }
}
