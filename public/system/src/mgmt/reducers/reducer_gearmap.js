import {
	FETCH_GEARMAP, FETCH_GEARMAP_SUCCESS, FETCH_GEARMAP_FAILURE, RESET_GEARMAP,
	SAVE_GEARMAP, SAVE_GEARMAP_SUCCESS, SAVE_GEARMAP_FAILURE, RESET_SAVE_GEARMAP
} from '../actions/gearmap';


	const INITIAL_STATE = { gearmapList: {gearmap: [], error:null, loading: false}};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {

  case FETCH_GEARMAP:// start fetching gearmap and set loading = true
  	return { ...state, gearmapList: {gearmap:[], error: null, loading: true} }; 
  case FETCH_GEARMAP_SUCCESS:// return list of gearmap and make loading = false
    return { ...state, gearmapList: {gearmap: action.payload.data, error:null, loading: false} };
  case FETCH_GEARMAP_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, gearmapList: {gearmap: [], error: error, loading: false} };
  case RESET_GEARMAP:// reset viewList to initial state
    return { ...state, gearmapList: {gearmap: [], error:null, loading: false} };


  case SAVE_GEARMAP:// start fetching gearmap and set loading = true
  	return { ...state, gearmapList: {gearmap:[], error: null, loading: true} }; 
  case SAVE_GEARMAP_SUCCESS:// return list of gearmap and make loading = false
    return { ...state, gearmapList: {gearmap: action.payload.data, error:null, loading: false} };
  case SAVE_GEARMAP_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, gearmapList: {gearmap: [], error: error, loading: false} };
  case RESET_SAVE_GEARMAP:// reset viewList to initial state
    return { ...state, gearmapList: {gearmap: [], error:null, loading: false} };


  default:
    return state;
  }
}