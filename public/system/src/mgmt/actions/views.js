import axios from 'axios';
import { ROOT_URL } from '../config.const';

//View list
export const FETCH_VIEWS = 'FETCH_VIEWS';
export const FETCH_VIEWS_SUCCESS = 'FETCH_VIEWS_SUCCESS';
export const FETCH_VIEWS_FAILURE = 'FETCH_VIEWS_FAILURE';
export const RESET_VIEWS = 'RESET_VIEWS';

//View save order
export const SAVE_OVIEWS = 'SAVE_OVIEWS';
export const SAVE_OVIEWS_SUCCESS = 'SAVE_OVIEWS_SUCCESS';
export const SAVE_OVIEWS_FAILURE = 'SAVE_OVIEWS_FAILURE';
export const RESET_SAVE_OVIEWS = 'RESET_SAVE_OVIEWS';


//Create new view
export const CREATE_VIEW = 'CREATE_VIEW';
export const CREATE_VIEW_SUCCESS = 'CREATE_VIEW_SUCCESS';
export const CREATE_VIEW_FAILURE = 'CREATE_VIEW_FAILURE';
export const RESET_NEW_VIEW = 'RESET_NEW_VIEW';

//Create new view
export const UPDATE_VIEW = 'UPDATE_VIEW';
export const UPDATE_VIEW_SUCCESS = 'UPDATE_VIEW_SUCCESS';
export const UPDATE_VIEW_FAILURE = 'UPDATE_VIEW_FAILURE';

//Validate view fields like Title, Categries on the server
export const VALIDATE_VIEW_FIELDS = 'VALIDATE_VIEW_FIELDS';
export const VALIDATE_VIEW_FIELDS_SUCCESS = 'VALIDATE_VIEW_FIELDS_SUCCESS';
export const VALIDATE_VIEW_FIELDS_FAILURE = 'VALIDATE_VIEW_FIELDS_FAILURE';
export const RESET_VIEW_FIELDS = 'RESET_VIEW_FIELDS';

//Fetch view
export const FETCH_VIEW = 'FETCH_VIEW';
export const FETCH_VIEW_SUCCESS = 'FETCH_VIEW_SUCCESS';
export const FETCH_VIEW_FAILURE = 'FETCH_VIEW_FAILURE';
export const RESET_ACTIVE_VIEW = 'RESET_ACTIVE_VIEW';

//Delete view
export const DELETE_VIEW = 'DELETE_VIEW';
export const DELETE_VIEW_SUCCESS = 'DELETE_VIEW_SUCCESS';
export const DELETE_VIEW_FAILURE = 'DELETE_VIEW_FAILURE';
export const RESET_DELETED_VIEW = 'RESET_DELETED_VIEW';

//Update CameraCoords
export const UPDATE_VIEWCAM = 'UPDATE_VIEWCAM';
export const UPDATE_VIEWCAM_SUCCESS = 'UPDATE_VIEWCAM_SUCCESS';
export const UPDATE_VIEWCAM_FAILURE = 'UPDATE_VIEWCAM_FAILURE';



export function fetchViews(parentType, parentId) {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/views`,
    params: { parentType, parentId },
    headers: []
  });

  return {
    type: FETCH_VIEWS,
    payload: request
  };
}

export function fetchViewsSuccess(views) {
  return {
    type: FETCH_VIEWS_SUCCESS,
    payload: views
  };
}

export function fetchViewsFailure(error) {
  return {
    type: FETCH_VIEWS_FAILURE,
    payload: error
  };
}


/* Save order */

export function saveOViews(viewsSetId, newOrderObject) {
  const request = axios({
    method: 'post',
    url: `${ROOT_URL}/viewsOrder`,
    data: { viewsSetId: viewsSetId, nOrder: newOrderObject || null },
    headers: []
  });

  return {
    type: SAVE_OVIEWS,
    payload: request
  };
}

export function saveOViewsSuccess(views) {
  return {
    type: SAVE_OVIEWS_SUCCESS,
    payload: views
  };
}

export function saveOViewsFailure(error) {
  return {
    type: SAVE_OVIEWS_FAILURE,
    payload: error
  };
}

/* Validate */

export function validateViewFields(props) {
  //note: we cant have /views/validateFields because it'll match /views/:id path!
  const request = axios.view(`${ROOT_URL}/views/validate/fields`, props);

  return {
    type: VALIDATE_VIEW_FIELDS,
    payload: request
  };
}

export function validateViewFieldsSuccess() {
  return {
    type: VALIDATE_VIEW_FIELDS_SUCCESS
  };
}

export function validateViewFieldsFailure(error) {
  return {
    type: VALIDATE_VIEW_FIELDS_FAILURE,
    payload: error
  };
}

/* New */

export function resetViewFields() {
  return {
    type: RESET_VIEW_FIELDS
  }
}


export function createView(props, viewsSetId) {
  const request = axios({
    method: 'post',
    data: { view: props, viewsSetId: viewsSetId },
    url: `${ROOT_URL}/views`
  });

  return {
    type: CREATE_VIEW,
    payload: request
  };
}

export function createViewSuccess(newView) {
  return {
    type: CREATE_VIEW_SUCCESS,
    payload: newView
  };
}

export function createViewFailure(error) {
  return {
    type: CREATE_VIEW_FAILURE,
    payload: error
  };
}

export function resetNewView() {
  return {
    type: RESET_NEW_VIEW
  }
};

export function resetDeletedView() {
  return {
    type: RESET_DELETED_VIEW
  }
};

/* UPDATE_VIEWCAM */

export function updateViewCam(view) {

  const request = new Promise(
    function(resolve, reject) {
      var ct = window.app3dViewer.viewPosition();
      //setTimeout(function() {
        var newView = _.clone(view || {});
        if (!newView.cameraPosition) { newView.cameraPosition = { x:0, y:0, z:0 }; }
        if (!newView.targetPosition) { newView.targetPosition = { x:0, y:0, z:0 }; }
        newView.cameraPosition.x = Math.round(ct[0].x * 1000) / 1000;
        newView.cameraPosition.y = Math.round(ct[0].y * 1000) / 1000;
        newView.cameraPosition.z = Math.round(ct[0].z * 1000) / 1000;
        newView.targetPosition.x = Math.round(ct[1].x * 1000) / 1000;
        newView.targetPosition.y = Math.round(ct[1].y * 1000) / 1000;
        newView.targetPosition.z = Math.round(ct[1].z * 1000) / 1000;
        resolve({data: { data: newView} });
      //}, 200);
    }
  );

  return {
    type: UPDATE_VIEWCAM,
    payload: request
  };
}

export function updateViewCamSuccess(newView) {
  return {
    type: UPDATE_VIEWCAM_SUCCESS,
    payload: newView
  };
}

export function updateViewCamFailure(error) {
  return {
    type: UPDATE_VIEWCAM_FAILURE,
    payload: error
  };
}

/* Fetch View (single) */

export function fetchView(id) {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/views/${id}`
  });

  return {
    type: FETCH_VIEW,
    payload: request
  };
}


export function fetchViewSuccess(activeView) {
  return {
    type: FETCH_VIEW_SUCCESS,
    payload: activeView
  };
}

export function fetchViewFailure(error) {
  return {
    type: FETCH_VIEW_FAILURE,
    payload: error
  };
}

export function resetActiveView() {
  return {
    type: RESET_ACTIVE_VIEW
  }
};

/* MODIFY */ 
export function updateView(view) {
  const request = axios({
    method: 'put',
    data: { view: view },
    url: `${ROOT_URL}/views`
  });

  return {
    type: UPDATE_VIEW,
    payload: request
  };
}


export function updateViewSuccess(activeView) {
  return {
    type: UPDATE_VIEW_SUCCESS,
    payload: activeView
  };
}

export function updateViewFailure(error) {
  return {
    type: UPDATE_VIEW_FAILURE,
    payload: error
  };
}


/* DELETE */

export function deleteView(id, viewsSetId) {
  const request = axios({
    method: 'delete',
    url: `${ROOT_URL}/views`,
    data: {viewId: id, viewsSetId: viewsSetId}
  });
  return {
    type: DELETE_VIEW,
    payload: request
  };
}

export function deleteViewSuccess(deletedView) {
  return {
    type: DELETE_VIEW_SUCCESS,
    payload: deletedView
  };
}

export function deleteViewFailure(response) {
  return {
    type: DELETE_VIEW_FAILURE,
    payload: response
  };
}
