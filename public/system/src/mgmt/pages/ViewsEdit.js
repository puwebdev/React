import React, { Component } from 'react';
import ViewForm from '../components/ViewsEditForm.js';

class ViewsNew extends Component {
  render() {
    return (
      <div>
        <ViewForm vsid={this.props.params.vsid} id={this.props.params.id}/>
      </div>
    );
  }
}

export default ViewsNew;