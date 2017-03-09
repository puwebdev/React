import React, { Component } from 'react';
import InfowinForm from '../components/InfowinsEditForm.js';

class InfowinsEdit extends Component {
  render() {
    return (
      <div>
        <InfowinForm
          parentType={this.props.params.parentType}
          parentId={this.props.params.parentId}
          id={this.props.params.id} />
      </div>
    );
  }
}

export default InfowinsEdit;