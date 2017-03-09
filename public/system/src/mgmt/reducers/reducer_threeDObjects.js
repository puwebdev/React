import {
  FETCH_THREEDOBJECTS, FETCH_THREEDOBJECTS_SUCCESS, FETCH_THREEDOBJECTS_FAILURE
} from '../actions/threeDObjects';

const INITIAL_STATE = { threeDObjectsList: {threeDObjects: [], error:null, loading: false} };

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {

    case FETCH_THREEDOBJECTS:// start fetching threeDObjects and set loading = true
      return { ...state, threeDObjectsList: {threeDObjects: [], error: null, loading: true} };
    case FETCH_THREEDOBJECTS_SUCCESS:// return list of threeDObjects and make loading = false
      return { ...state, threeDObjectsList: {threeDObjects: action.payload.data, error:null, loading: false} };
    case FETCH_THREEDOBJECTS_FAILURE:// return error and make loading = false
      error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
      return { ...state, threeDObjectsList: {threeDObjects: [], error: error, loading: false} };
    default:
      return state;
  }
}
