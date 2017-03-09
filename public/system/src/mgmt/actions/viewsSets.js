import axios from 'axios';
import { ROOT_URL } from '../config.const';

//ViewsSet list
export const FETCH_VIEWSSETS = 'FETCH_VIEWSSETS';
export const FETCH_VIEWSSETS_SUCCESS = 'FETCH_VIEWSSETS_SUCCESS';
export const FETCH_VIEWSSETS_FAILURE = 'FETCH_VIEWSSETS_FAILURE';
export const RESET_VIEWSSETS = 'RESET_VIEWSSETS';

//ViewsSet save order
export const SAVE_OVIEWSSETS = 'SAVE_OVIEWSSETS';
export const SAVE_OVIEWSSETS_SUCCESS = 'SAVE_OVIEWSSETS_SUCCESS';
export const SAVE_OVIEWSSETS_FAILURE = 'SAVE_OVIEWSSETS_FAILURE';
export const RESET_SAVE_OVIEWSSETS = 'RESET_SAVE_OVIEWSSETS';


//Create new viewsSet
export const CREATE_VIEWSSET = 'CREATE_VIEWSSET';
export const CREATE_VIEWSSET_SUCCESS = 'CREATE_VIEWSSET_SUCCESS';
export const CREATE_VIEWSSET_FAILURE = 'CREATE_VIEWSSET_FAILURE';
export const RESET_NEW_VIEWSSET = 'RESET_NEW_VIEWSSET';

//Create new viewsSet
export const UPDATE_VIEWSSET = 'UPDATE_VIEWSSET';
export const UPDATE_VIEWSSET_SUCCESS = 'UPDATE_VIEWSSET_SUCCESS';
export const UPDATE_VIEWSSET_FAILURE = 'UPDATE_VIEWSSET_FAILURE';

//Validate viewsSet fields like Title, Categries on the server
export const VALIDATE_VIEWSSET_FIELDS = 'VALIDATE_VIEWSSET_FIELDS';
export const VALIDATE_VIEWSSET_FIELDS_SUCCESS = 'VALIDATE_VIEWSSET_FIELDS_SUCCESS';
export const VALIDATE_VIEWSSET_FIELDS_FAILURE = 'VALIDATE_VIEWSSET_FIELDS_FAILURE';
export const RESET_VIEWSSET_FIELDS = 'RESET_VIEWSSET_FIELDS';

//Fetch viewsSet
export const FETCH_VIEWSSET = 'FETCH_VIEWSSET';
export const FETCH_VIEWSSET_SUCCESS = 'FETCH_VIEWSSET_SUCCESS';
export const FETCH_VIEWSSET_FAILURE = 'FETCH_VIEWSSET_FAILURE';
export const RESET_ACTIVE_VIEWSSET = 'RESET_ACTIVE_VIEWSSET';

//Delete viewsSet
export const DELETE_VIEWSSET = 'DELETE_VIEWSSET';
export const DELETE_VIEWSSET_SUCCESS = 'DELETE_VIEWSSET_SUCCESS';
export const DELETE_VIEWSSET_FAILURE = 'DELETE_VIEWSSET_FAILURE';
export const RESET_DELETED_VIEWSSET = 'RESET_DELETED_VIEWSSET';

//Update CameraCoords
export const UPDATE_VIEWSSETCAM = 'UPDATE_VIEWSSETCAM';
export const UPDATE_VIEWSSETCAM_SUCCESS = 'UPDATE_VIEWSSETCAM_SUCCESS';
export const UPDATE_VIEWSSETCAM_FAILURE = 'UPDATE_VIEWSSETCAM_FAILURE';



export function fetchViewsSets(worldId) {
  var upd = Number(new Date());
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/viewsSets`,
    params: { worldId: worldId, upd: upd }
  });

  return {
    type: FETCH_VIEWSSETS,
    payload: request
  };
}

export function fetchViewsSetsSuccess(viewsSets) {
  return {
    type: FETCH_VIEWSSETS_SUCCESS,
    payload: viewsSets
  };
}

export function fetchViewsSetsFailure(error) {
  return {
    type: FETCH_VIEWSSETS_FAILURE,
    payload: error
  };
}


/* Save order */

export function saveOViewsSets(worldId, newOrderObject) {
  const request = axios({
    method: 'post',
    url: `${ROOT_URL}/viewsSetsOrder`,
    data: { worldId: worldId, nOrder: newOrderObject || null },
    headers: []
  });

  return {
    type: SAVE_OVIEWSSETS,
    payload: request
  };
}

export function saveOViewsSetsSuccess(viewsSets) {
  return {
    type: SAVE_OVIEWSSETS_SUCCESS,
    payload: viewsSets
  };
}

export function saveOViewsSetsFailure(error) {
  return {
    type: SAVE_OVIEWSSETS_FAILURE,
    payload: error
  };
}

/* Validate */

export function validateViewsSetFields(props) {
  //note: we cant have /viewsSets/validateFields because it'll match /viewsSets/:id path!
  const request = axios.viewsSet(`${ROOT_URL}/viewsSets/validate/fields`, props);

  return {
    type: VALIDATE_VIEWSSET_FIELDS,
    payload: request
  };
}

export function validateViewsSetFieldsSuccess() {
  return {
    type: VALIDATE_VIEWSSET_FIELDS_SUCCESS
  };
}

export function validateViewsSetFieldsFailure(error) {
  return {
    type: VALIDATE_VIEWSSET_FIELDS_FAILURE,
    payload: error
  };
}

/* New */

export function resetViewsSetFields() {
  return {
    type: RESET_VIEWSSET_FIELDS
  }
};


export function createViewsSet(props, worldId) {
  const request = axios({
    method: 'post',
    data: { viewsSet: props, worldId: worldId },
    url: `${ROOT_URL}/viewsSets`
  });

  return {
    type: CREATE_VIEWSSET,
    payload: request
  };
}

export function createViewsSetSuccess(newViewsSet) {
  return {
    type: CREATE_VIEWSSET_SUCCESS,
    payload: newViewsSet
  };
}

export function createViewsSetFailure(error) {
  return {
    type: CREATE_VIEWSSET_FAILURE,
    payload: error
  };
}

export function resetNewViewsSet() {
  return {
    type: RESET_NEW_VIEWSSET
  }
};

export function resetDeletedViewsSet() {
  return {
    type: RESET_DELETED_VIEWSSET
  }
};

/* Fetch ViewsSet (single) */

export function fetchViewsSet(id) {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/viewsSets/${id}`
  });

  return {
    type: FETCH_VIEWSSET,
    payload: request
  };
}


export function fetchViewsSetSuccess(activeViewsSet) {
  return {
    type: FETCH_VIEWSSET_SUCCESS,
    payload: activeViewsSet
  };
}

export function fetchViewsSetFailure(error) {
  return {
    type: FETCH_VIEWSSET_FAILURE,
    payload: error
  };
}

export function resetActiveViewsSet() {
  return {
    type: RESET_ACTIVE_VIEWSSET
  }
};

/* MODIFY */ 
export function updateViewsSet(viewsSet) {
  const request = axios({
    method: 'put',
    data: { viewsSet: viewsSet },
    url: `${ROOT_URL}/viewsSets`
  });

  return {
    type: UPDATE_VIEWSSET,
    payload: request
  };
}


export function updateViewsSetSuccess(activeViewsSet) {
  return {
    type: UPDATE_VIEWSSET_SUCCESS,
    payload: activeViewsSet
  };
}

export function updateViewsSetFailure(error) {
  return {
    type: UPDATE_VIEWSSET_FAILURE,
    payload: error
  };
}


/* DELETE */

export function deleteViewsSet(id, worldId) {
  const request = axios({
    method: 'delete',
    url: `${ROOT_URL}/viewsSets`,
    data: {viewsSetId: id, worldId: worldId}
  });
  return {
    type: DELETE_VIEWSSET,
    payload: request
  };
}

export function deleteViewsSetSuccess(deletedViewsSet) {
  return {
    type: DELETE_VIEWSSET_SUCCESS,
    payload: deletedViewsSet
  };
}

export function deleteViewsSetFailure(response) {
  return {
    type: DELETE_VIEWSSET_FAILURE,
    payload: response
  };
}