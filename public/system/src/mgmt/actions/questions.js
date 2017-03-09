import axios from 'axios';
import { ROOT_URL } from '../config.const';

//Infowin list
export const FETCH_QUESTIONS = 'FETCH_QUESTIONS';
export const FETCH_QUESTIONS_SUCCESS = 'FETCH_QUESTIONS_SUCCESS';
export const FETCH_QUESTIONS_FAILURE = 'FETCH_QUESTIONS_FAILURE';
export const RESET_QUESTIONS = 'RESET_QUESTIONS';

//Infowin save order
export const SAVE_OQUESTIONS = 'SAVE_OQUESTIONS';
export const SAVE_OQUESTIONS_SUCCESS = 'SAVE_OQUESTIONS_SUCCESS';
export const SAVE_OQUESTIONS_FAILURE = 'SAVE_OQUESTIONS_FAILURE';
export const RESET_SAVE_OQUESTIONS = 'RESET_SAVE_OQUESTIONS';


//Create new infowin
export const CREATE_QUESTION = 'CREATE_QUESTION';
export const CREATE_QUESTION_SUCCESS = 'CREATE_QUESTION_SUCCESS';
export const CREATE_QUESTION_FAILURE = 'CREATE_QUESTION_FAILURE';
export const RESET_NEW_QUESTION = 'RESET_NEW_QUESTION';

//Create new infowin
export const UPDATE_QUESTION = 'UPDATE_QUESTION';
export const UPDATE_QUESTION_SUCCESS = 'UPDATE_QUESTION_SUCCESS';
export const UPDATE_QUESTION_FAILURE = 'UPDATE_QUESTION_FAILURE';

//Validate infowin fields like Title, Categries on the server
export const VALIDATE_QUESTION_FIELDS = 'VALIDATE_QUESTION_FIELDS';
export const VALIDATE_QUESTION_FIELDS_SUCCESS = 'VALIDATE_QUESTION_FIELDS_SUCCESS';
export const VALIDATE_QUESTION_FIELDS_FAILURE = 'VALIDATE_QUESTION_FIELDS_FAILURE';
export const RESET_QUESTION_FIELDS = 'RESET_QUESTION_FIELDS';

//Fetch infowin
export const FETCH_QUESTION = 'FETCH_QUESTION';
export const FETCH_QUESTION_SUCCESS = 'FETCH_QUESTION_SUCCESS';
export const FETCH_QUESTION_FAILURE = 'FETCH_QUESTION_FAILURE';
export const RESET_ACTIVE_QUESTION = 'RESET_ACTIVE_QUESTION';

//Delete infowin
export const DELETE_QUESTION = 'DELETE_QUESTION';
export const DELETE_QUESTION_SUCCESS = 'DELETE_QUESTION_SUCCESS';
export const DELETE_QUESTION_FAILURE = 'DELETE_QUESTION_FAILURE';
export const RESET_DELETED_QUESTION = 'RESET_DELETED_QUESTION';

//Update CameraCoords
export const UPDATE_QUESTIONCAM = 'UPDATE_QUESTIONCAM';
export const UPDATE_QUESTIONCAM_SUCCESS = 'UPDATE_QUESTIONCAM_SUCCESS';
export const UPDATE_QUESTIONCAM_FAILURE = 'UPDATE_QUESTIONCAM_FAILURE';



export function fetchQuestions(worldId, newOrderObject) {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/questions`,
    params: { worldId: worldId },
    headers: []
  });

  return {
    type: FETCH_QUESTIONS,
    payload: request
  };
}

export function fetchQuestionsSuccess(infowins) {
  return {
    type: FETCH_QUESTIONS_SUCCESS,
    payload: infowins
  };
}

export function fetchQuestionsFailure(error) {
  return {
    type: FETCH_QUESTIONS_FAILURE,
    payload: error
  };
}


/* Save order */

export function saveOQuestions(worldId, newOrderObject) {
  const request = axios({
    method: 'post',
    url: `${ROOT_URL}/questionsOrder`,
    data: { worldId: worldId, nOrder: newOrderObject || null },
    headers: []
  });

  return {
    type: SAVE_OQUESTIONS,
    payload: request
  };
}

export function saveOQuestionsSuccess(questions) {
  return {
    type: SAVE_OQUESTIONS_SUCCESS,
    payload: questions
  };
}

export function saveOQuestionsFailure(error) {
  return {
    type: SAVE_OQUESTIONS_FAILURE,
    payload: error
  };
}

/* Validate */

export function validateQuestionFields(props) {
  //note: we cant have /infowins/validateFields because it'll match /infowins/:id path!
  const request = axios.question(`${ROOT_URL}/questions/validate/fields`, props);

  return {
    type: VALIDATE_QUESTION_FIELDS,
    payload: request
  };
}

export function validateQuestionFieldsSuccess() {
  return {
    type: VALIDATE_QUESTION_FIELDS_SUCCESS
  };
}

export function validateQuestionFieldsFailure(error) {
  return {
    type: VALIDATE_QUESTION_FIELDS_FAILURE,
    payload: error
  };
}

/* New */

export function resetQuestionFields() {
  return {
    type: RESET_QUESTION_FIELDS
  }
};


export function createQuestion(props, parentType, parentId) {
  console.log("createQuestion=", props);
  const request = axios({
    method: 'post',
    data: { question: props, parentType, parentId },
    url: `${ROOT_URL}/questions`
  });

  return {
    type: CREATE_QUESTION,
    payload: request
  };
}

export function createQuestionSuccess(newQuestion) {
  console.log("createQuestionSuccess=", newQuestion);
  return {
    type: CREATE_QUESTION_SUCCESS,
    payload: newQuestion
  };
}

export function createQuestionFailure(error) {
  return {
    type: CREATE_QUESTION_FAILURE,
    payload: error
  };
}

export function resetNewQuestion() {
  return {
    type: RESET_NEW_QUESTION
  }
};

export function resetDeletedQuestion() {
  return {
    type: RESET_DELETED_QUESTION
  }
};

/* UPDATE_INFOWINCAM */
/*
export function updateQuestionCam(question) {

  const request = new Promise(
    function(resolve, reject) {
      var ct = window.app3dQuestioner.infowinPosition();
      //setTimeout(function() {
        var newQuestion = _.clone(question || {});
        if (!newQuestion.cameraPosition) { newQuestion.cameraPosition = { x:0, y:0, z:0 }; }
        if (!newQuestion.targetPosition) { newQuestion.targetPosition = { x:0, y:0, z:0 }; }
        newQuestion.cameraPosition.x = Math.round(ct[0].x * 1000) / 1000;
        newQuestion.cameraPosition.y = Math.round(ct[0].y * 1000) / 1000;
        newQuestion.cameraPosition.z = Math.round(ct[0].z * 1000) / 1000;
        newQuestion.targetPosition.x = Math.round(ct[1].x * 1000) / 1000;
        newQuestion.targetPosition.y = Math.round(ct[1].y * 1000) / 1000;
        newQuestion.targetPosition.z = Math.round(ct[1].z * 1000) / 1000;
        resolve({data: { data: newQuestion} });
      //}, 200);
    }
  );

  return {
    type: UPDATE_QUESTIONCAM,
    payload: request
  };
}
*/
export function updateQuestionCamSuccess(newQuestion) {
  return {
    type: UPDATE_QUESTIONCAM_SUCCESS,
    payload: newQuestion
  };
}

export function updateQuestionCamFailure(error) {
  return {
    type: UPDATE_QUESTIONCAM_FAILURE,
    payload: error
  };
}

/* Fetch Infowin (single) */

export function fetchQuestion(id) {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/questions/${id}`
  });

  return {
    type: FETCH_QUESTION,
    payload: request
  };
}


export function fetchQuestionSuccess(activeQuestion) {
  console.log("fetchQuestionSuccess:", activeQuestion);
  return {
    type: FETCH_QUESTION_SUCCESS,
    payload: activeQuestion
  };
}

export function fetchQuestionFailure(error) {
  return {
    type: FETCH_QUESTION_FAILURE,
    payload: error
  };
}

export function resetActiveQuestion() {
  return {
    type: RESET_ACTIVE_QUESTION
  }
};

/* MODIFY */ 
export function updateQuestion(question) {
  const request = axios({
    method: 'put',
    data: { question: question },
    url: `${ROOT_URL}/questions`
  });

  return {
    type: UPDATE_QUESTION,
    payload: request
  };
}


export function updateQuestionSuccess(activeQuestion) {
  return {
    type: UPDATE_QUESTION_SUCCESS,
    payload: activeQuestion
  };
}

export function updateQuestionFailure(error) {
  return {
    type: UPDATE_QUESTION_FAILURE,
    payload: error
  };
}


/* DELETE */

export function deleteQuestion(parentType, parentId, id) {
  const request = axios({
    method: 'delete',
    url: `${ROOT_URL}/questions`,
    data: {questionId: id, parentType, parentId}
  });
  return {
    type: DELETE_QUESTION,
    payload: request
  };
}

export function deleteQuestionSuccess(deletedQuestion) {
  return {
    type: DELETE_QUESTION_SUCCESS,
    payload: deletedQuestion
  };
}

export function deleteQuestionFailure(response) {
  return {
    type: DELETE_QUESTION_FAILURE,
    payload: response
  };
}