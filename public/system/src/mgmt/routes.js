import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './pages/App';
import WelcomeIndex from './pages/WelcomeIndex';
import InfowinsIndex from './pages/InfowinsIndex';
import InfowinsNew from './pages/InfowinsNew';
import InfowinsEdit from './pages/InfowinsEdit';
import MarkersEdit from './pages/MarkersEdit';
import MarkersNew from './pages/MarkersNew';
import GearmapIndex from './pages/GearmapIndex';

export default (
  <Route path="/" component={App}>

    <IndexRoute component={WelcomeIndex} />

    <Route path="infowins" component={InfowinsIndex} />
    <Route path="infowins/new/:parentType/:parentId" component={InfowinsNew} />
    <Route path="infowins/:parentType/:parentId/:id" component={InfowinsEdit} />

    <Route path="markers/new/:parentId" component={MarkersNew} />
    <Route path="markers/:parentId/:id" component={MarkersEdit} />

    <Route path="gearmap" component={GearmapIndex} />
  </Route>
);