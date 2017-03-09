import axios from 'axios';
import { ROOT_URL } from '../config.const';

//Infowin list
export const FETCH_INFOWINS = 'FETCH_INFOWINS';
export const FETCH_INFOWINS_SUCCESS = 'FETCH_INFOWINS_SUCCESS';
export const FETCH_INFOWINS_FAILURE = 'FETCH_INFOWINS_FAILURE';
export const RESET_INFOWINS = 'RESET_INFOWINS';

//Infowin save order
export const SAVE_OINFOWINS = 'SAVE_OINFOWINS';
export const SAVE_OINFOWINS_SUCCESS = 'SAVE_OINFOWINS_SUCCESS';
export const SAVE_OINFOWINS_FAILURE = 'SAVE_OINFOWINS_FAILURE';
export const RESET_SAVE_OINFOWINS = 'RESET_SAVE_OINFOWINS';


//Create new infowin
export const CREATE_INFOWIN = 'CREATE_INFOWIN';
export const CREATE_INFOWIN_SUCCESS = 'CREATE_INFOWIN_SUCCESS';
export const CREATE_INFOWIN_FAILURE = 'CREATE_INFOWIN_FAILURE';
export const RESET_NEW_INFOWIN = 'RESET_NEW_INFOWIN';

//Create new infowin
export const UPDATE_INFOWIN = 'UPDATE_INFOWIN';
export const UPDATE_INFOWIN_SUCCESS = 'UPDATE_INFOWIN_SUCCESS';
export const UPDATE_INFOWIN_FAILURE = 'UPDATE_INFOWIN_FAILURE';

//Validate infowin fields like Title, Categries on the server
export const VALIDATE_INFOWIN_FIELDS = 'VALIDATE_INFOWIN_FIELDS';
export const VALIDATE_INFOWIN_FIELDS_SUCCESS = 'VALIDATE_INFOWIN_FIELDS_SUCCESS';
export const VALIDATE_INFOWIN_FIELDS_FAILURE = 'VALIDATE_INFOWIN_FIELDS_FAILURE';
export const RESET_INFOWIN_FIELDS = 'RESET_INFOWIN_FIELDS';

//Fetch infowin
export const FETCH_INFOWIN = 'FETCH_INFOWIN';
export const FETCH_INFOWIN_SUCCESS = 'FETCH_INFOWIN_SUCCESS';
export const FETCH_INFOWIN_FAILURE = 'FETCH_INFOWIN_FAILURE';
export const RESET_ACTIVE_INFOWIN = 'RESET_ACTIVE_INFOWIN';

//Delete infowin
export const DELETE_INFOWIN = 'DELETE_INFOWIN';
export const DELETE_INFOWIN_SUCCESS = 'DELETE_INFOWIN_SUCCESS';
export const DELETE_INFOWIN_FAILURE = 'DELETE_INFOWIN_FAILURE';
export const RESET_DELETED_INFOWIN = 'RESET_DELETED_INFOWIN';

//Clone infowin
export const CLONE_INFOWIN = 'CLONE_INFOWIN';
export const CLONE_INFOWIN_SUCCESS = 'CLONE_INFOWIN_SUCCESS';
export const CLONE_INFOWIN_FAILURE = 'CLONE_INFOWIN_FAILURE';

//Update CameraCoords
export const UPDATE_INFOWINCAM = 'UPDATE_INFOWINCAM';
export const UPDATE_INFOWINCAM_SUCCESS = 'UPDATE_INFOWINCAM_SUCCESS';
export const UPDATE_INFOWINCAM_FAILURE = 'UPDATE_INFOWINCAM_FAILURE';



export function fetchInfowins(worldId, newOrderObject) {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/infowins`,
    params: { worldId: worldId },
    headers: []
  });

  return {
    type: FETCH_INFOWINS,
    payload: request
  };
}

export function fetchInfowinsSuccess(infowins) {
  return {
    type: FETCH_INFOWINS_SUCCESS,
    payload: infowins
  };
}

export function fetchInfowinsFailure(error) {
  return {
    type: FETCH_INFOWINS_FAILURE,
    payload: error
  };
}


/* Save order */

export function saveOInfowins(worldId, newOrderObject) {
  const request = axios({
    method: 'post',
    url: `${ROOT_URL}/infowinsOrder`,
    data: { worldId: worldId, nOrder: newOrderObject || null },
    headers: []
  });

  return {
    type: SAVE_OINFOWINS,
    payload: request
  };
}

export function saveOInfowinsSuccess(infowins) {
  return {
    type: SAVE_OINFOWINS_SUCCESS,
    payload: infowins
  };
}

export function saveOInfowinsFailure(error) {
  return {
    type: SAVE_OINFOWINS_FAILURE,
    payload: error
  };
}

/* Validate */

export function validateInfowinFields(props) {
  //note: we cant have /infowins/validateFields because it'll match /infowins/:id path!
  const request = axios.infowin(`${ROOT_URL}/infowins/validate/fields`, props);

  return {
    type: VALIDATE_INFOWIN_FIELDS,
    payload: request
  };
}

export function validateInfowinFieldsSuccess() {
  return {
    type: VALIDATE_INFOWIN_FIELDS_SUCCESS
  };
}

export function validateInfowinFieldsFailure(error) {
  return {
    type: VALIDATE_INFOWIN_FIELDS_FAILURE,
    payload: error
  };
}

/* New */

export function resetInfowinFields() {
  return {
    type: RESET_INFOWIN_FIELDS
  }
};


export function createInfowin(props, parentType, parentId) {
  const request = axios({
    method: 'post',
    data: { infowin: props, parentType, parentId },
    url: `${ROOT_URL}/infowins`
  });

  return {
    type: CREATE_INFOWIN,
    payload: request
  };
}

export function createInfowinSuccess(newInfowin) {
  return {
    type: CREATE_INFOWIN_SUCCESS,
    payload: newInfowin
  };
}

export function createInfowinFailure(error) {
  return {
    type: CREATE_INFOWIN_FAILURE,
    payload: error
  };
}

export function resetNewInfowin() {
  return {
    type: RESET_NEW_INFOWIN
  }
};

export function resetDeletedInfowin() {
  return {
    type: RESET_DELETED_INFOWIN
  }
};

/* UPDATE_INFOWINCAM */

export function updateInfowinCam(infowin) {

  const request = new Promise(
    function(resolve, reject) {
      var ct = window.app3dInfowiner.infowinPosition();
      //setTimeout(function() {
        var newInfowin = _.clone(infowin || {});
        if (!newInfowin.cameraPosition) { newInfowin.cameraPosition = { x:0, y:0, z:0 }; }
        if (!newInfowin.targetPosition) { newInfowin.targetPosition = { x:0, y:0, z:0 }; }
        newInfowin.cameraPosition.x = Math.round(ct[0].x * 1000) / 1000;
        newInfowin.cameraPosition.y = Math.round(ct[0].y * 1000) / 1000;
        newInfowin.cameraPosition.z = Math.round(ct[0].z * 1000) / 1000;
        newInfowin.targetPosition.x = Math.round(ct[1].x * 1000) / 1000;
        newInfowin.targetPosition.y = Math.round(ct[1].y * 1000) / 1000;
        newInfowin.targetPosition.z = Math.round(ct[1].z * 1000) / 1000;
        resolve({data: { data: newInfowin} });
      //}, 200);
    }
  );

  return {
    type: UPDATE_INFOWINCAM,
    payload: request
  };
}

export function updateInfowinCamSuccess(newInfowin) {
  return {
    type: UPDATE_INFOWINCAM_SUCCESS,
    payload: newInfowin
  };
}

export function updateInfowinCamFailure(error) {
  return {
    type: UPDATE_INFOWINCAM_FAILURE,
    payload: error
  };
}

/* Fetch Infowin (single) */

export function fetchInfowin(id) {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/infowins/${id}`
  });

  return {
    type: FETCH_INFOWIN,
    payload: request
  };
}


export function fetchInfowinSuccess(activeInfowin) {
  return {
    type: FETCH_INFOWIN_SUCCESS,
    payload: activeInfowin
  };
}

export function fetchInfowinFailure(error) {
  return {
    type: FETCH_INFOWIN_FAILURE,
    payload: error
  };
}

export function resetActiveInfowin() {
  return {
    type: RESET_ACTIVE_INFOWIN
  }
};

/* MODIFY */ 
export function updateInfowin(infowin) {
  const request = axios({
    method: 'put',
    data: { infowin: infowin },
    url: `${ROOT_URL}/infowins`
  });

  return {
    type: UPDATE_INFOWIN,
    payload: request
  };
}


export function updateInfowinSuccess(activeInfowin) {
  return {
    type: UPDATE_INFOWIN_SUCCESS,
    payload: activeInfowin
  };
}

export function updateInfowinFailure(error) {
  return {
    type: UPDATE_INFOWIN_FAILURE,
    payload: error
  };
}


/* DELETE */

export function deleteInfowin(parentType, parentId, id) {
  const request = axios({
    method: 'delete',
    url: `${ROOT_URL}/infowins`,
    data: {infowinId: id, parentType, parentId}
  });
  return {
    type: DELETE_INFOWIN,
    payload: request
  };
}

export function deleteInfowinSuccess(deletedInfowin) {
  return {
    type: DELETE_INFOWIN_SUCCESS,
    payload: deletedInfowin
  };
}

export function deleteInfowinFailure(response) {
  return {
    type: DELETE_INFOWIN_FAILURE,
    payload: response
  };
}

/* CLONE */

export function cloneInfowin(parentType, parentId, relativePosition, id) {
  const request = axios({
    method: 'POST',
    url: `${ROOT_URL}/infowins/clone`,
    data: { originalInfowinId: id, parentType, parentId, relativePosition }
  });
  return {
    type: CLONE_INFOWIN,
    payload: request
  };
}

export function cloneInfowinSuccess(clonedInfowin) {
  return {
    type: CLONE_INFOWIN_SUCCESS,
    payload: clonedInfowin
  };
}

export function cloneInfowinFailure(response) {
  return {
    type: CLONE_INFOWIN_FAILURE,
    payload: response
  };
}
