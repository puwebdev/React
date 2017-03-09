import {
	FETCH_MARKERS, FETCH_MARKERS_SUCCESS, FETCH_MARKERS_FAILURE, RESET_MARKERS,
	SAVE_OMARKERS, SAVE_OMARKERS_SUCCESS, SAVE_OMARKERS_FAILURE, RESET_SAVE_OMARKERS,
	FETCH_MARKER, FETCH_MARKER_SUCCESS,  FETCH_MARKER_FAILURE, RESET_ACTIVE_MARKER,
	CREATE_MARKER, CREATE_MARKER_SUCCESS, CREATE_MARKER_FAILURE, RESET_NEW_MARKER,
	DELETE_MARKER, DELETE_MARKER_SUCCESS, DELETE_MARKER_FAILURE, RESET_DELETED_MARKER,
  CLONE_MARKER, CLONE_MARKER_SUCCESS, CLONE_MARKER_FAILURE,
  VALIDATE_MARKER_FIELDS,VALIDATE_MARKER_FIELDS_SUCCESS, VALIDATE_MARKER_FIELDS_FAILURE, RESET_MARKER_FIELDS
} from '../actions/markers';

  let baseMarker = {
    title: "",
    dismissText: "Got it!",
    optionsOnShowFeedback: "{}",
    optionsOnDismissFeedback: "{}"
  };

	const INITIAL_STATE = { markersList: {markers: [], error:null, loading: false},  
							newMarker:{marker:baseMarker, error: null, loading: false}, 
							activeMarker:{marker:null, error:null, loading: false}, 
							deletedMarker: {marker: null, error:null, loading: false}
						};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {

  case FETCH_MARKERS:// start fetching markers and set loading = true
  	return { ...state, markersList: {markers:[], error: null, loading: true} }; 
  case FETCH_MARKERS_SUCCESS:// return list of markers and make loading = false
    return { ...state, markersList: {markers: action.payload.data, error:null, loading: false} };
  case FETCH_MARKERS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, markersList: {markers: [], error: error, loading: false} };
  case RESET_MARKERS:// reset markerList to initial state
    return { ...state, markersList: {markers: [], error:null, loading: false} };


  case SAVE_OMARKERS:// start fetching markers and set loading = true
  	return { ...state, markersList: {markers:[], error: null, loading: true} }; 
  case SAVE_OMARKERS_SUCCESS:// return list of markers and make loading = false
    return { ...state, markersList: {markers: action.payload.data, error:null, loading: false} };
  case SAVE_OMARKERS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, markersList: {markers: [], error: error, loading: false} };
  case RESET_SAVE_OMARKERS:// reset markerList to initial state
    return { ...state, markersList: {markers: [], error:null, loading: false} };


  case FETCH_MARKER:
    return { ...state, activeMarker:{...state.activeMarker, loading: true}};
  case FETCH_MARKER_SUCCESS:
    return { ...state, activeMarker: {marker: action.payload.data, error:null, loading: false}};
  case FETCH_MARKER_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, activeMarker: {marker: null, error:error, loading:false}};
  case RESET_ACTIVE_MARKER:
    return { ...state, activeMarker: {marker: null, error:null, loading: false}};


  case CREATE_MARKER:
  	return {...state, newMarker: {...state.newMarker, loading: true}}
  case CREATE_MARKER_SUCCESS:
  	return {...state, newMarker: {marker:action.payload.data, error:null, loading: false}}
  case CREATE_MARKER_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, newMarker: {marker:null, error:error, loading: false}}
  case RESET_NEW_MARKER:
  	return {...state,  newMarker:{marker:null, error:null, loading: false}}

  case DELETE_MARKER:
   	return {...state, deletedMarker: {...state.deletedMarker, loading: true}}
  case DELETE_MARKER_SUCCESS:
  	return {...state, deletedMarker: {marker:action.payload.data, error:null, loading: false}}
  case DELETE_MARKER_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, deletedMarker: {marker:null, error:error, loading: false}}
  case RESET_DELETED_MARKER:
  	return {...state,  deletedMarker:{marker:null, error:null, loading: false}}

  case VALIDATE_MARKER_FIELDS:
    return {...state, newMarker:{...state.newMarker, error: null, loading: true}}
  case VALIDATE_MARKER_FIELDS_SUCCESS:
    return {...state, newMarker:{...state.newMarker, error: null, loading: false}}
  case VALIDATE_MARKER_FIELDS_FAILURE:
    let result = action.payload.data;
    if(!result) {
      error = {message: action.payload.message};
    } else {
      error = {title: result.title, categories: result.categories, description: result.description};
    }
    return {...state, newMarker:{...state.newMarker, error: error, loading: false}}
  case RESET_MARKER_FIELDS:
    return {...state, newMarker:{...state.newMarker, error: null, loading: null}}
  default:
    return state;
  }
}