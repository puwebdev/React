import {
	FETCH_QUESTIONS, FETCH_QUESTIONS_SUCCESS, FETCH_QUESTIONS_FAILURE, RESET_QUESTIONS,
	SAVE_OQUESTIONS, SAVE_OQUESTIONS_SUCCESS, SAVE_OQUESTIONS_FAILURE, RESET_SAVE_OQUESTIONS,
	FETCH_QUESTION, FETCH_QUESTION_SUCCESS,  FETCH_QUESTION_FAILURE, RESET_ACTIVE_QUESTION,
	CREATE_QUESTION, CREATE_QUESTION_SUCCESS, CREATE_QUESTION_FAILURE, RESET_NEW_QUESTION,
	DELETE_QUESTION, DELETE_QUESTION_SUCCESS, DELETE_QUESTION_FAILURE, RESET_DELETED_QUESTION,
  VALIDATE_QUESTION_FIELDS,VALIDATE_QUESTION_FIELDS_SUCCESS, VALIDATE_QUESTION_FIELDS_FAILURE, RESET_QUESTION_FIELDS,
  UPDATE_QUESTIONCAM, UPDATE_QUESTIONCAM_SUCCESS, UPDATE_QUESTIONCAM_FAILURE
} from '../actions/questions';

  let baseQuestion = {
    title: "",
    description: "",
    qtype: "multi",
    answer1: "",
    fraction1: "0.0",
    feedback1: "",
    answer2: "",
    fraction2: "0.0",
    feedback2: "",
    answer3: "",
    fraction3: "0.0",
    feedback3: "",
    answer4: "",
    fraction4: "0.0",
    feedback4: "",
    answer5: "",
    fraction5: "0.0",
    feedback5: ""
  };

	const INITIAL_STATE = { questionsList: {questions: [], error:null, loading: false},  
							newQuestion:{question:baseQuestion, error: null, loading: false}, 
							activeQuestion:{question:null, error:null, loading: false}, 
							deletedQuestion: {question: null, error:null, loading: false},
						};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {

  case FETCH_QUESTIONS:// start fetching questions and set loading = true
  	return { ...state, questionsList: {questions:[], error: null, loading: true} }; 
  case FETCH_QUESTIONS_SUCCESS:// return list of questions and make loading = false
    return { ...state, questionsList: {questions: action.payload.data, error:null, loading: false} };
  case FETCH_QUESTIONS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, questionsList: {questions: [], error: error, loading: false} };
  case RESET_QUESTIONS:// reset questionList to initial state
    return { ...state, questionsList: {questions: [], error:null, loading: false} };


  case SAVE_OQUESTIONS:// start fetching questions and set loading = true
  	return { ...state, questionsList: {questions:[], error: null, loading: true} }; 
  case SAVE_OQUESTIONS_SUCCESS:// return list of questions and make loading = false
    return { ...state, questionsList: {questions: action.payload.data, error:null, loading: false} };
  case SAVE_OQUESTIONS_FAILURE:// return error and make loading = false
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, questionsList: {questions: [], error: error, loading: false} };
  case RESET_SAVE_OQUESTIONS:// reset questionList to initial state
    return { ...state, questionsList: {questions: [], error:null, loading: false} };


  case FETCH_QUESTION:
    return { ...state, activeQuestion:{...state.activeQuestion, loading: true}};
  case FETCH_QUESTION_SUCCESS:
    return { ...state, activeQuestion: {question: action.payload.data, error:null, loading: false}};
  case FETCH_QUESTION_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
    return { ...state, activeQuestion: {question: null, error:error, loading:false}};
  case RESET_ACTIVE_QUESTION:
    return { ...state, activeQuestion: {question: null, error:null, loading: false}};


  case CREATE_QUESTION:
  	return {...state, newQuestion: {...state.newQuestion, loading: true}}
  case CREATE_QUESTION_SUCCESS:
  	return {...state, newQuestion: {question:action.payload.data, error:null, loading: false}}
  case CREATE_QUESTION_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, newQuestion: {question:null, error:error, loading: false}}
  case RESET_NEW_QUESTION:
  	return {...state,  newQuestion:{question:null, error:null, loading: false}}

  case UPDATE_QUESTIONCAM:
    return {...state, newQuestion: {...state.newQuestion, error: null, loading: true}}
  case UPDATE_QUESTIONCAM_SUCCESS:
    return {...state, newQuestion:{question: action.payload.data, error: null, loading: false}}
  case UPDATE_QUESTIONCAM_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, newQuestion: {question:null, error:error, loading: false}}


  case DELETE_QUESTION:
   	return {...state, deletedQuestion: {...state.deletedQuestion, loading: true}}
  case DELETE_QUESTION_SUCCESS:
  	return {...state, deletedQuestion: {question:action.payload.data, error:null, loading: false}}
  case DELETE_QUESTION_FAILURE:
    error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
  	return {...state, deletedQuestion: {question:null, error:error, loading: false}}
  case RESET_DELETED_QUESTION:
  	return {...state,  deletedQuestion:{question:null, error:null, loading: false}}

  case VALIDATE_QUESTION_FIELDS:
    return {...state, newQuestion:{...state.newQuestion, error: null, loading: true}}
  case VALIDATE_QUESTION_FIELDS_SUCCESS:
    return {...state, newQuestion:{...state.newQuestion, error: null, loading: false}}
  case VALIDATE_QUESTION_FIELDS_FAILURE:
    let result = action.payload.data;
    if(!result) {
      error = {message: action.payload.message};
    } else {
      error = {title: result.title, categories: result.categories, description: result.description};
    }
    return {...state, newQuestion:{...state.newQuestion, error: error, loading: false}}
  case RESET_QUESTION_FIELDS:
    return {...state, newQuestion:{...state.newQuestion, error: null, loading: null}}
  default:
    return state;
  }
}