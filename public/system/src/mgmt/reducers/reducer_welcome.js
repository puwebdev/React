import {
	FETCH_CAMPOS, FETCH_CAMPOS_SUCCESS, FETCH_CAMPOS_FAILURE
} from '../actions/welcome';


const INITIAL_STATE = { camPos: {data: [], error:null, loading: false }};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {
      case FETCH_CAMPOS:// start fetching views and set loading = true
  	return { ...state, camPos: {data:[], error: null, loading: true} }; 
  case FETCH_CAMPOS_SUCCESS:// return list of views and make loading = false
    return { ...state, camPos: {data: action.payload, error:null, loading: false} };
  case FETCH_CAMPOS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, camPos: {data: [], error: error, loading: false} };

      default:
    return state;
  }
}