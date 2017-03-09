import React, { Component } from 'react';
import ViewsList from '../containers/ViewsListContainer.js';

class ViewsIndex extends Component {
  render() {
    return (
      <div>
        <ViewsList vsid={this.props.params.vsid}/>
      </div>
    );
  }
}


export default ViewsIndex;