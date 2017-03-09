import axios from 'axios';
import { ROOT_URL } from '../config.const';

//Marker list
export const FETCH_MARKERS = 'FETCH_MARKERS';
export const FETCH_MARKERS_SUCCESS = 'FETCH_MARKERS_SUCCESS';
export const FETCH_MARKERS_FAILURE = 'FETCH_MARKERS_FAILURE';
export const RESET_MARKERS = 'RESET_MARKERS';

//Marker save order
export const SAVE_OMARKERS = 'SAVE_OMARKERS';
export const SAVE_OMARKERS_SUCCESS = 'SAVE_OMARKERS_SUCCESS';
export const SAVE_OMARKERS_FAILURE = 'SAVE_OMARKERS_FAILURE';
export const RESET_SAVE_OMARKERS = 'RESET_SAVE_OMARKERS';


//Create new marker
export const CREATE_MARKER = 'CREATE_MARKER';
export const CREATE_MARKER_SUCCESS = 'CREATE_MARKER_SUCCESS';
export const CREATE_MARKER_FAILURE = 'CREATE_MARKER_FAILURE';
export const RESET_NEW_MARKER = 'RESET_NEW_MARKER';

//Create new marker
export const UPDATE_MARKER = 'UPDATE_MARKER';
export const UPDATE_MARKER_SUCCESS = 'UPDATE_MARKER_SUCCESS';
export const UPDATE_MARKER_FAILURE = 'UPDATE_MARKER_FAILURE';

//Validate marker fields like Title, Categries on the server
export const VALIDATE_MARKER_FIELDS = 'VALIDATE_MARKER_FIELDS';
export const VALIDATE_MARKER_FIELDS_SUCCESS = 'VALIDATE_MARKER_FIELDS_SUCCESS';
export const VALIDATE_MARKER_FIELDS_FAILURE = 'VALIDATE_MARKER_FIELDS_FAILURE';
export const RESET_MARKER_FIELDS = 'RESET_MARKER_FIELDS';

//Fetch marker
export const FETCH_MARKER = 'FETCH_MARKER';
export const FETCH_MARKER_SUCCESS = 'FETCH_MARKER_SUCCESS';
export const FETCH_MARKER_FAILURE = 'FETCH_MARKER_FAILURE';
export const RESET_ACTIVE_MARKER = 'RESET_ACTIVE_MARKER';

//Delete marker
export const DELETE_MARKER = 'DELETE_MARKER';
export const DELETE_MARKER_SUCCESS = 'DELETE_MARKER_SUCCESS';
export const DELETE_MARKER_FAILURE = 'DELETE_MARKER_FAILURE';
export const RESET_DELETED_MARKER = 'RESET_DELETED_MARKER';

//Clone marker
export const CLONE_MARKER = 'CLONE_MARKER';
export const CLONE_MARKER_SUCCESS = 'CLONE_MARKER_SUCCESS';
export const CLONE_MARKER_FAILURE = 'CLONE_MARKER_FAILURE';

//Update CameraCoords
export const UPDATE_MARKERCAM = 'UPDATE_MARKERCAM';
export const UPDATE_MARKERCAM_SUCCESS = 'UPDATE_MARKERCAM_SUCCESS';
export const UPDATE_MARKERCAM_FAILURE = 'UPDATE_MARKERCAM_FAILURE';



export function fetchMarkers(worldId, newOrderObject) {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/markers`,
    params: { worldId: worldId },
    headers: []
  });

  return {
    type: FETCH_MARKERS,
    payload: request
  };
}

export function fetchMarkersSuccess(markers) {
  return {
    type: FETCH_MARKERS_SUCCESS,
    payload: markers
  };
}

export function fetchMarkersFailure(error) {
  return {
    type: FETCH_MARKERS_FAILURE,
    payload: error
  };
}


/* Save order */

export function saveOMarkers(worldId, newOrderObject) {
  const request = axios({
    method: 'post',
    url: `${ROOT_URL}/markersOrder`,
    data: { worldId: worldId, nOrder: newOrderObject || null },
    headers: []
  });

  return {
    type: SAVE_OMARKERS,
    payload: request
  };
}

export function saveOMarkersSuccess(markers) {
  return {
    type: SAVE_OMARKERS_SUCCESS,
    payload: markers
  };
}

export function saveOMarkersFailure(error) {
  return {
    type: SAVE_OMARKERS_FAILURE,
    payload: error
  };
}

/* Validate */

export function validateMarkerFields(props) {
  //note: we cant have /markers/validateFields because it'll match /markers/:id path!
  const request = axios.marker(`${ROOT_URL}/markers/validate/fields`, props);

  return {
    type: VALIDATE_MARKER_FIELDS,
    payload: request
  };
}

export function validateMarkerFieldsSuccess() {
  return {
    type: VALIDATE_MARKER_FIELDS_SUCCESS
  };
}

export function validateMarkerFieldsFailure(error) {
  return {
    type: VALIDATE_MARKER_FIELDS_FAILURE,
    payload: error
  };
}

/* New */

export function resetMarkerFields() {
  return {
    type: RESET_MARKER_FIELDS
  }
};


export function createMarker(props, parentId) {
  const request = axios({
    method: 'post',
    data: { marker: props, parentId },
    url: `${ROOT_URL}/markers`
  });

  return {
    type: CREATE_MARKER,
    payload: request
  };
}

export function createMarkerSuccess(newMarker) {
  return {
    type: CREATE_MARKER_SUCCESS,
    payload: newMarker
  };
}

export function createMarkerFailure(error) {
  return {
    type: CREATE_MARKER_FAILURE,
    payload: error
  };
}

export function resetNewMarker() {
  return {
    type: RESET_NEW_MARKER
  }
};

export function resetDeletedMarker() {
  return {
    type: RESET_DELETED_MARKER
  }
};

/* Fetch Marker (single) */

export function fetchMarker(id) {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/markers/${id}`
  });

  return {
    type: FETCH_MARKER,
    payload: request
  };
}


export function fetchMarkerSuccess(activeMarker) {
  return {
    type: FETCH_MARKER_SUCCESS,
    payload: activeMarker
  };
}

export function fetchMarkerFailure(error) {
  return {
    type: FETCH_MARKER_FAILURE,
    payload: error
  };
}

export function resetActiveMarker() {
  return {
    type: RESET_ACTIVE_MARKER
  }
};

/* MODIFY */ 
export function updateMarker(marker, parentId) {
  const request = axios({
    method: 'put',
    data: { marker, parentId },
    url: `${ROOT_URL}/markers`
  });

  return {
    type: UPDATE_MARKER,
    payload: request
  };
}


export function updateMarkerSuccess(activeMarker) {
  return {
    type: UPDATE_MARKER_SUCCESS,
    payload: activeMarker
  };
}

export function updateMarkerFailure(error) {
  return {
    type: UPDATE_MARKER_FAILURE,
    payload: error
  };
}


/* DELETE */

export function deleteMarker(parentId, id) {
  const request = axios({
    method: 'delete',
    url: `${ROOT_URL}/markers`,
    data: {markerId: id, parentId}
  });
  return {
    type: DELETE_MARKER,
    payload: request
  };
}

export function deleteMarkerSuccess(deletedMarker) {
  return {
    type: DELETE_MARKER_SUCCESS,
    payload: deletedMarker
  };
}

export function deleteMarkerFailure(response) {
  return {
    type: DELETE_MARKER_FAILURE,
    payload: response
  };
}
