import React, { Component } from 'react';
import InfowinForm from '../components/InfowinsNewForm.js';

class InfowinsNew extends Component {
  render() {
    return (
      <div>
        <InfowinForm parentType={this.props.params.parentType} parentId={this.props.params.parentId} />
      </div>
    );
  }
}

export default InfowinsNew;