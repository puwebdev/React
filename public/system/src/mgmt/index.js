import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore.js';
import { createHashHistory } from 'history';

const appHistory = useRouterHistory( createHashHistory )({});

const store = configureStore();
window.app3dMgmtStore = store;
window.app3dMgmtHistory = appHistory;

let appM = <Provider store={store}>
            <Router history={appHistory} routes={routes} />
          </Provider>;


ReactDOM.render(
  appM
  , document.getElementById("mgmt"));