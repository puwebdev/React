import {
	FETCH_VIEWSSETS, FETCH_VIEWSSETS_SUCCESS, FETCH_VIEWSSETS_FAILURE, RESET_VIEWSSETS,
	SAVE_OVIEWSSETS, SAVE_OVIEWSSETS_SUCCESS, SAVE_OVIEWSSETS_FAILURE, RESET_SAVE_OVIEWSSETS,
	FETCH_VIEWSSET, FETCH_VIEWSSET_SUCCESS,  FETCH_VIEWSSET_FAILURE, RESET_ACTIVE_VIEWSSET,
	CREATE_VIEWSSET, CREATE_VIEWSSET_SUCCESS, CREATE_VIEWSSET_FAILURE, RESET_NEW_VIEWSSET,
	DELETE_VIEWSSET, DELETE_VIEWSSET_SUCCESS, DELETE_VIEWSSET_FAILURE, RESET_DELETED_VIEWSSET,
  VALIDATE_VIEWSSET_FIELDS,VALIDATE_VIEWSSET_FIELDS_SUCCESS, VALIDATE_VIEWSSET_FIELDS_FAILURE, RESET_VIEWSSET_FIELDS
} from '../actions/viewsSets';

  let baseViewsSet = {
    title: "",
    name: ""
  };

	const INITIAL_STATE = { viewsSetsList: {viewsSets: [], error:null, loading: false},  
							newViewsSet:{viewsSet:baseViewsSet, error: null, loading: false}, 
							activeViewsSet:{viewsSet:null, error:null, loading: false}, 
							deletedViewsSet: {viewsSet: null, error:null, loading: false},
						};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {

  case FETCH_VIEWSSETS:// start fetching viewsSets and set loading = true
  	return { ...state, viewsSetsList: {viewsSets:[], error: null, loading: true} }; 
  case FETCH_VIEWSSETS_SUCCESS:// return list of viewsSets and make loading = false
    return { ...state, viewsSetsList: {viewsSets: action.payload.data, error:null, loading: false} };
  case FETCH_VIEWSSETS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, viewsSetsList: {viewsSets: [], error: error, loading: false} };
  case RESET_VIEWSSETS:// reset viewsSetList to initial state
    return { ...state, viewsSetsList: {viewsSets: [], error:null, loading: false} };


  case SAVE_OVIEWSSETS:// start fetching viewsSets and set loading = true
  	return { ...state, viewsSetsList: {viewsSets:[], error: null, loading: true} }; 
  case SAVE_OVIEWSSETS_SUCCESS:// return list of viewsSets and make loading = false
    return { ...state, viewsSetsList: {viewsSets: action.payload.data, error:null, loading: false} };
  case SAVE_OVIEWSSETS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, viewsSetsList: {viewsSets: [], error: error, loading: false} };
  case RESET_SAVE_OVIEWSSETS:// reset viewsSetList to initial state
    return { ...state, viewsSetsList: {viewsSets: [], error:null, loading: false} };


  case FETCH_VIEWSSET:
    return { ...state, activeViewsSet:{...state.activeViewsSet, loading: true}};
  case FETCH_VIEWSSET_SUCCESS:
    return { ...state, activeViewsSet: {viewsSet: action.payload.data, error:null, loading: false}};
  case FETCH_VIEWSSET_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, activeViewsSet: {viewsSet: null, error:error, loading:false}};
  case RESET_ACTIVE_VIEWSSET:
    return { ...state, activeViewsSet: {viewsSet: null, error:null, loading: false}};


  case CREATE_VIEWSSET:
  	return {...state, newViewsSet: {...state.newViewsSet, loading: true}}
  case CREATE_VIEWSSET_SUCCESS:
  	return {...state, newViewsSet: {viewsSet:action.payload.data, error:null, loading: false}}
  case CREATE_VIEWSSET_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, newViewsSet: {viewsSet:null, error:error, loading: false}}
  case RESET_NEW_VIEWSSET:
  	return {...state,  newViewsSet:{viewsSet:null, error:null, loading: false}}


  case DELETE_VIEWSSET:
   	return {...state, deletedViewsSet: {...state.deletedViewsSet, loading: true}}
  case DELETE_VIEWSSET_SUCCESS:
  	return {...state, deletedViewsSet: {viewsSet:action.payload.data, error:null, loading: false}}
  case DELETE_VIEWSSET_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, deletedViewsSet: {viewsSet:null, error:error, loading: false}}
  case RESET_DELETED_VIEWSSET:
  	return {...state,  deletedViewsSet:{viewsSet:null, error:null, loading: false}}

  case VALIDATE_VIEWSSET_FIELDS:
    return {...state, newViewsSet:{...state.newViewsSet, error: null, loading: true}}
  case VALIDATE_VIEWSSET_FIELDS_SUCCESS:
    return {...state, newViewsSet:{...state.newViewsSet, error: null, loading: false}}
  case VALIDATE_VIEWSSET_FIELDS_FAILURE:
    let result = action.payload.data;
    if(!result) {
      error = {message: action.payload.message};
    } else {
      error = {title: result.title, categories: result.categories, description: result.description};
    }
    return {...state, newViewsSet:{...state.newViewsSet, error: error, loading: false}}
  case RESET_VIEWSSET_FIELDS:
    return {...state, newViewsSet:{...state.newViewsSet, error: null, loading: null}}
  default:
    return state;
  }
}