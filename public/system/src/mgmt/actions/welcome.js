//Camera coords
export const FETCH_CAMPOS = 'FETCH_CAMPOS';
export const FETCH_CAMPOS_SUCCESS = 'FETCH_CAMPOS_SUCCESS';
export const FETCH_CAMPOS_FAILURE = 'FETCH_CAMPOS_FAILURE';

export function fetchCamPos() {
  const request = new Promise(
    function(resolve, reject) {
      setTimeout(function(){
        resolve(window.app3dViewer.viewPosition());
      }, 200);
    }
  );

  return {
    type: FETCH_CAMPOS,
    payload: request
  };
}

export function fetchCamPosSuccess(data) {
  return {
    type: FETCH_CAMPOS_SUCCESS,
    payload: data
  };
}

export function fetchCamPosFailure(error) {
  return {
    type: FETCH_CAMPOS_FAILURE,
    payload: error
  };
}

