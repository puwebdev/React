import React, { Component } from 'react';
import MarkerForm from '../components/MarkersEditForm.js';

class MarkersEdit extends Component {
  render() {
    return (
      <div>
        <MarkerForm
          parentId={this.props.params.parentId}
          id={this.props.params.id} />
      </div>
    );
  }
}

export default MarkersEdit;