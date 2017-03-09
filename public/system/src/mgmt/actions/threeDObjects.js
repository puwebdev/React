import axios from 'axios';
import { ROOT_URL } from '../config.const';

//ThreeDObject list
export const FETCH_THREEDOBJECTS = 'FETCH_THREEDOBJECTS';
export const FETCH_THREEDOBJECTS_SUCCESS = 'FETCH_THREEDOBJECTS_SUCCESS';
export const FETCH_THREEDOBJECTS_FAILURE = 'FETCH_THREEDOBJECTS_FAILURE';

export function fetchThreeDObjects() {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/threeDObjects`,
    params: {},
    headers: []
  });

  return {
    type: FETCH_THREEDOBJECTS,
    payload: request
  };
}

export function fetchThreeDObjectsSuccess(threeDObjects) {
  return {
    type: FETCH_THREEDOBJECTS_SUCCESS,
    payload: threeDObjects
  };
}

export function fetchThreeDObjectsFailure(error) {
  return {
    type: FETCH_THREEDOBJECTS_FAILURE,
    payload: error
  };
}
