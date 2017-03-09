import React from 'react';
import { Component } from 'react';
import AppContainer from '../containers/AppContainer';
import HeaderContainer from '../containers/HeaderContainer.js';

export default class App extends Component {
  render() {
    return (
      <div>
        <div className="react-mgmt-app-header">
          <HeaderContainer/>
        </div>
        <AppContainer>
          <div className="react-mgmt-app-body">
            {this.props.children}
          </div>
        </AppContainer>
      </div>
    );
  }
}