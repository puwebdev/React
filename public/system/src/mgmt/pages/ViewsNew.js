import React, { Component } from 'react';
import ViewForm from '../components/ViewsNewForm.js';

class ViewsNew extends Component {
  render() {
    return (
      <div>
        <ViewForm vsid={this.props.params.vsid} />
      </div>
    );
  }
}

export default ViewsNew;