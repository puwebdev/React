import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './pages/App';
import WelcomeIndex from './pages/WelcomeIndex';
import ViewsSetsIndex from './pages/ViewsSetsIndex';
import ViewsSetsNew from './pages/ViewsSetsNew';
import ViewsSetsEdit from './pages/ViewsSetsEdit';
import ViewsIndex from './pages/ViewsIndex';
import ViewsNew from './pages/ViewsNew';
import ViewsEdit from './pages/ViewsEdit';
import InfowinsIndex from './pages/InfowinsIndex';
import InfowinsNew from './pages/InfowinsNew';
import QuestionNew from './pages/QuestionNew';
import InfowinsEdit from './pages/InfowinsEdit';
import QuestionEdit from './pages/QuestionEdit';
import MarkersEdit from './pages/MarkersEdit';
import MarkersNew from './pages/MarkersNew';
import GearmapIndex from './pages/GearmapIndex';

export default (
  <Route path="/" component={App}>

    <IndexRoute component={WelcomeIndex} />

    <Route path="viewsSets/new" component={ViewsSetsNew} />
    <Route path="viewsSets" component={ViewsSetsIndex} />
    <Route path="viewsSets/:vsid" component={ViewsSetsEdit} />

    <Route path="vSviews/:vsid" component={ViewsIndex} />
    <Route path="vSviews/:vsid/new" component={ViewsNew} />
    <Route path="vSviews/:vsid/:id" component={ViewsEdit} />

    <Route path="infowins" component={InfowinsIndex} />
    <Route path="infowins/new/:parentType/:parentId" component={InfowinsNew} />
    <Route path="questions/new/:parentType/:parentId" component={QuestionNew} />
    <Route path="infowins/:parentType/:parentId/:id" component={InfowinsEdit} />
    <Route path="questions/:parentType/:parentId/:id" component={QuestionEdit} />

    <Route path="markers/new/:parentId" component={MarkersNew} />
    <Route path="markers/:parentId/:id" component={MarkersEdit} />

    <Route path="gearmap" component={GearmapIndex} />
  </Route>
);