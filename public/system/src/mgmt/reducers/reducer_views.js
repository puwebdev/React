import {
	FETCH_VIEWS, FETCH_VIEWS_SUCCESS, FETCH_VIEWS_FAILURE, RESET_VIEWS,
	SAVE_OVIEWS, SAVE_OVIEWS_SUCCESS, SAVE_OVIEWS_FAILURE, RESET_SAVE_OVIEWS,
	FETCH_VIEW, FETCH_VIEW_SUCCESS,  FETCH_VIEW_FAILURE, RESET_ACTIVE_VIEW,
	CREATE_VIEW, CREATE_VIEW_SUCCESS, CREATE_VIEW_FAILURE, RESET_NEW_VIEW,
	DELETE_VIEW, DELETE_VIEW_SUCCESS, DELETE_VIEW_FAILURE, RESET_DELETED_VIEW,
  VALIDATE_VIEW_FIELDS,VALIDATE_VIEW_FIELDS_SUCCESS, VALIDATE_VIEW_FIELDS_FAILURE, RESET_VIEW_FIELDS,
  UPDATE_VIEWCAM, UPDATE_VIEWCAM_SUCCESS, UPDATE_VIEWCAM_FAILURE
} from '../actions/views';

  let baseView = {
    title: "",
    name: "",
    keyCode: 0,
    cameraPosition: {x:0, y:0, z:0}, 
    targetPosition: {x:0, y:0, z:0}
  };

	const INITIAL_STATE = { viewsList: {views: [], error:null, loading: false},  
							newView:{view:baseView, error: null, loading: false}, 
							activeView:{view:null, error:null, loading: false}, 
							deletedView: {view: null, error:null, loading: false},
						};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {

  case FETCH_VIEWS:// start fetching views and set loading = true
  	return { ...state, viewsList: {views:[], error: null, loading: true} }; 
  case FETCH_VIEWS_SUCCESS:// return list of views and make loading = false
    return { ...state, viewsList: {views: action.payload.data, error:null, loading: false} };
  case FETCH_VIEWS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, viewsList: {views: [], error: error, loading: false} };
  case RESET_VIEWS:// reset viewList to initial state
    return { ...state, viewsList: {views: [], error:null, loading: false} };


  case SAVE_OVIEWS:// start fetching views and set loading = true
  	return { ...state, viewsList: {views:[], error: null, loading: true} }; 
  case SAVE_OVIEWS_SUCCESS:// return list of views and make loading = false
    return { ...state, viewsList: {views: action.payload.data, error:null, loading: false} };
  case SAVE_OVIEWS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, viewsList: {views: [], error: error, loading: false} };
  case RESET_SAVE_OVIEWS:// reset viewList to initial state
    return { ...state, viewsList: {views: [], error:null, loading: false} };


  case FETCH_VIEW:
    return { ...state, activeView:{...state.activeView, loading: true}};
  case FETCH_VIEW_SUCCESS:
    return { ...state, activeView: {view: action.payload.data, error:null, loading: false}};
  case FETCH_VIEW_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, activeView: {view: null, error:error, loading:false}};
  case RESET_ACTIVE_VIEW:
    return { ...state, activeView: {view: null, error:null, loading: false}};


  case CREATE_VIEW:
  	return {...state, newView: {...state.newView, loading: true}}
  case CREATE_VIEW_SUCCESS:
  	return {...state, newView: {view:action.payload.data, error:null, loading: false}}
  case CREATE_VIEW_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, newView: {view:null, error:error, loading: false}}
  case RESET_NEW_VIEW:
  	return {...state,  newView:{view:null, error:null, loading: false}}

  case UPDATE_VIEWCAM:
    return {...state, newView: {...state.newView, error: null, loading: true}}
  case UPDATE_VIEWCAM_SUCCESS:
    return {...state, newView:{view: action.payload.data, error: null, loading: false}}
  case UPDATE_VIEWCAM_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, newView: {view:null, error:error, loading: false}}


  case DELETE_VIEW:
   	return {...state, deletedView: {...state.deletedView, loading: true}}
  case DELETE_VIEW_SUCCESS:
  	return {...state, deletedView: {view:action.payload.data, error:null, loading: false}}
  case DELETE_VIEW_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, deletedView: {view:null, error:error, loading: false}}
  case RESET_DELETED_VIEW:
  	return {...state,  deletedView:{view:null, error:null, loading: false}}

  case VALIDATE_VIEW_FIELDS:
    return {...state, newView:{...state.newView, error: null, loading: true}}
  case VALIDATE_VIEW_FIELDS_SUCCESS:
    return {...state, newView:{...state.newView, error: null, loading: false}}
  case VALIDATE_VIEW_FIELDS_FAILURE:
    let result = action.payload.data;
    if(!result) {
      error = {message: action.payload.message};
    } else {
      error = {title: result.title, categories: result.categories, description: result.description};
    }
    return {...state, newView:{...state.newView, error: error, loading: false}}
  case RESET_VIEW_FIELDS:
    return {...state, newView:{...state.newView, error: null, loading: null}}
  default:
    return state;
  }
}