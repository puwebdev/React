import { combineReducers } from 'redux';
import ViewsReducer from './reducer_views';
import ViewsSetsReducer from './reducer_viewsSets';
import ThreeDObjectsReducer from './reducer_threeDObjects';
import InfowinsReducer from './reducer_infowins';
import QuestionReducer from './reducer_questions';
import WelcomeReducer from './reducer_welcome';
import MarkersReducer from './reducer_markers';
import GearmapReducer from './reducer_gearmap';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    welcome: WelcomeReducer, //<-- Welcome
    views: ViewsReducer, //<-- Views
    viewsSets: ViewsSetsReducer, //<-- ViewsSets
    threeDObjects: ThreeDObjectsReducer, //<-- ThreeDObjects
    infowins: InfowinsReducer, //<-- Infowins
    questions: QuestionReducer, //<-- Questions
    markers: MarkersReducer, //<-- Markers
    gearmap: GearmapReducer, //<-- Gearmap
    form: formReducer 
});

export default rootReducer;
