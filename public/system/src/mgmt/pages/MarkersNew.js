import React, { Component } from 'react';
import MarkerForm from '../components/MarkersNewForm.js';

class MarkersNew extends Component {
  render() {
    return (
      <div>
        <MarkerForm 
          parentId={this.props.params.parentId}
        />
      </div>
    );
  }
}

export default MarkersNew;