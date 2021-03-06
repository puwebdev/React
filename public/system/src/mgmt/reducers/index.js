import { combineReducers } from 'redux';
import InfowinsReducer from './reducer_infowins';
import WelcomeReducer from './reducer_welcome';
import MarkersReducer from './reducer_markers';
import GearmapReducer from './reducer_gearmap';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    welcome: WelcomeReducer, //<-- Welcome
    infowins: InfowinsReducer, //<-- Infowins
    markers: MarkersReducer, //<-- Markers
    gearmap: GearmapReducer, //<-- Gearmap
    form: formReducer 
});

export default rootReducer;
