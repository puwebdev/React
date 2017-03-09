import axios from 'axios';
import { ROOT_URL } from '../config.const';

//Infowin list
export const FETCH_GEARMAP = 'FETCH_GEARMAP';
export const FETCH_GEARMAP_SUCCESS = 'FETCH_GEARMAP_SUCCESS';
export const FETCH_GEARMAP_FAILURE = 'FETCH_GEARMAP_FAILURE';
export const RESET_GEARMAP = 'RESET_GEARMAP';

//Infowin save order
export const SAVE_GEARMAP = 'SAVE_GEARMAP';
export const SAVE_GEARMAP_SUCCESS = 'SAVE_GEARMAP_SUCCESS';
export const SAVE_GEARMAP_FAILURE = 'SAVE_GEARMAP_FAILURE';
export const RESET_SAVE_GEARMAP = 'RESET_SAVE_GEARMAP';

export function fetchGearmap(worldId, newOrderObject) {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/gearmap`,
    params: { worldId: worldId }
  });

  return {
    type: FETCH_GEARMAP,
    payload: request
  };
}

export function fetchGearmapSuccess(gearmap) {
  return {
    type: FETCH_GEARMAP_SUCCESS,
    payload: gearmap
  };
}

export function fetchGearmapFailure(error) {
  return {
    type: FETCH_GEARMAP_FAILURE,
    payload: error
  };
}


/* Save */

export function saveGearmap(worldId, gearmap) {
  const request = axios({
    method: 'put',
    url: `${ROOT_URL}/gearmap`,
    data: { worldId: worldId, gearmap: gearmap || null }
  });

  return {
    type: SAVE_GEARMAP,
    payload: request
  };
}

export function saveGearmapSuccess(gearmap) {
  return {
    type: SAVE_GEARMAP_SUCCESS,
    payload: gearmap
  };
}

export function saveGearmapFailure(error) {
  return {
    type: SAVE_GEARMAP_FAILURE,
    payload: error
  };
}
