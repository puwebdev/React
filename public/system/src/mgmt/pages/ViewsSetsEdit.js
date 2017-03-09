import React, { Component } from 'react';
import ViewsSetsForm from '../components/ViewsSetsEditForm.js';

class ViewsSetsNew extends Component {
  render() {
    return (
      <div>
        <ViewsSetsForm vsid={this.props.params.vsid} />
      </div>
    );
  }
}

export default ViewsSetsNew;