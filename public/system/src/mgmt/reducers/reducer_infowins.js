import {
	FETCH_INFOWINS, FETCH_INFOWINS_SUCCESS, FETCH_INFOWINS_FAILURE, RESET_INFOWINS,
	SAVE_OINFOWINS, SAVE_OINFOWINS_SUCCESS, SAVE_OINFOWINS_FAILURE, RESET_SAVE_OINFOWINS,
	FETCH_INFOWIN, FETCH_INFOWIN_SUCCESS,  FETCH_INFOWIN_FAILURE, RESET_ACTIVE_INFOWIN,
	CREATE_INFOWIN, CREATE_INFOWIN_SUCCESS, CREATE_INFOWIN_FAILURE, RESET_NEW_INFOWIN,
	DELETE_INFOWIN, DELETE_INFOWIN_SUCCESS, DELETE_INFOWIN_FAILURE, RESET_DELETED_INFOWIN,
  CLONE_INFOWIN, CLONE_INFOWIN_SUCCESS, CLONE_INFOWIN_FAILURE,
  VALIDATE_INFOWIN_FIELDS,VALIDATE_INFOWIN_FIELDS_SUCCESS, VALIDATE_INFOWIN_FIELDS_FAILURE, RESET_INFOWIN_FIELDS,
  UPDATE_INFOWINCAM, UPDATE_INFOWINCAM_SUCCESS, UPDATE_INFOWINCAM_FAILURE
} from '../actions/infowins';

  let baseInfowin = {
    title: "",
    name: ""
  };

	const INITIAL_STATE = { infowinsList: {infowins: [], error:null, loading: false},  
							newInfowin:{infowin:baseInfowin, error: null, loading: false}, 
							activeInfowin:{infowin:null, error:null, loading: false}, 
							deletedInfowin: {infowin: null, error:null, loading: false},
              clonedInfowin: {infowin: null, error:null, loading: false},
						};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {

  case FETCH_INFOWINS:// start fetching infowins and set loading = true
  	return { ...state, infowinsList: {infowins:[], error: null, loading: true} }; 
  case FETCH_INFOWINS_SUCCESS:// return list of infowins and make loading = false
    return { ...state, infowinsList: {infowins: action.payload.data, error:null, loading: false} };
  case FETCH_INFOWINS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, infowinsList: {infowins: [], error: error, loading: false} };
  case RESET_INFOWINS:// reset infowinList to initial state
    return { ...state, infowinsList: {infowins: [], error:null, loading: false} };


  case SAVE_OINFOWINS:// start fetching infowins and set loading = true
  	return { ...state, infowinsList: {infowins:[], error: null, loading: true} }; 
  case SAVE_OINFOWINS_SUCCESS:// return list of infowins and make loading = false
    return { ...state, infowinsList: {infowins: action.payload.data, error:null, loading: false} };
  case SAVE_OINFOWINS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, infowinsList: {infowins: [], error: error, loading: false} };
  case RESET_SAVE_OINFOWINS:// reset infowinList to initial state
    return { ...state, infowinsList: {infowins: [], error:null, loading: false} };


  case FETCH_INFOWIN:
    return { ...state, activeInfowin:{...state.activeInfowin, loading: true}};
  case FETCH_INFOWIN_SUCCESS:
    return { ...state, activeInfowin: {infowin: action.payload.data, error:null, loading: false}};
  case FETCH_INFOWIN_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, activeInfowin: {infowin: null, error:error, loading:false}};
  case RESET_ACTIVE_INFOWIN:
    return { ...state, activeInfowin: {infowin: null, error:null, loading: false}};


  case CREATE_INFOWIN:
  	return {...state, newInfowin: {...state.newInfowin, loading: true}}
  case CREATE_INFOWIN_SUCCESS:
  	return {...state, newInfowin: {infowin:action.payload.data, error:null, loading: false}}
  case CREATE_INFOWIN_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, newInfowin: {infowin:null, error:error, loading: false}}
  case RESET_NEW_INFOWIN:
  	return {...state,  newInfowin:{infowin:null, error:null, loading: false}}

  case UPDATE_INFOWINCAM:
    return {...state, newInfowin: {...state.newInfowin, error: null, loading: true}}
  case UPDATE_INFOWINCAM_SUCCESS:
    return {...state, newInfowin:{infowin: action.payload.data, error: null, loading: false}}
  case UPDATE_INFOWINCAM_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, newInfowin: {infowin:null, error:error, loading: false}}


  case DELETE_INFOWIN:
   	return {...state, deletedInfowin: {...state.deletedInfowin, loading: true}}
  case DELETE_INFOWIN_SUCCESS:
  	return {...state, deletedInfowin: {infowin:action.payload.data, error:null, loading: false}}
  case DELETE_INFOWIN_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, deletedInfowin: {infowin:null, error:error, loading: false}}
  case RESET_DELETED_INFOWIN:
  	return {...state,  deletedInfowin:{infowin:null, error:null, loading: false}}

  case CLONE_INFOWIN:
    return {...state, clonedInfowin: { ...state.clonedInfowin, loading: true }}
  case CLONE_INFOWIN_SUCCESS:
    return {...state, clonedInfowin: { infowin: action.payload.data, error: null, loading: false }}
  case CLONE_INFOWIN_FAILURE:
    error = action.payload.data || { message: action.payload.message };//2nd one is network or server down errors
    return {...state, clonedInfowin: { infowin: null, error: error, loading: false }}

  case VALIDATE_INFOWIN_FIELDS:
    return {...state, newInfowin:{...state.newInfowin, error: null, loading: true}}
  case VALIDATE_INFOWIN_FIELDS_SUCCESS:
    return {...state, newInfowin:{...state.newInfowin, error: null, loading: false}}
  case VALIDATE_INFOWIN_FIELDS_FAILURE:
    let result = action.payload.data;
    if(!result) {
      error = {message: action.payload.message};
    } else {
      error = {title: result.title, categories: result.categories, description: result.description};
    }
    return {...state, newInfowin:{...state.newInfowin, error: error, loading: false}}
  case RESET_INFOWIN_FIELDS:
    return {...state, newInfowin:{...state.newInfowin, error: null, loading: null}}
  default:
    return state;
  }
}