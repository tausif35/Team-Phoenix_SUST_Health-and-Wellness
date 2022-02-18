import {
  GET_QUESTIONS_FAIL,
  GET_QUESTIONS_REQUEST,
  GET_QUESTIONS_SUCCESS,
  GET_SINGLE_QUESTION_FAIL,
  GET_SINGLE_QUESTION_REQUEST,
  GET_SINGLE_QUESTION_SUCCESS,
  POST_QUESTION_FAIL,
  POST_QUESTION_REQUEST,
  POST_QUESTION_SUCCESS,
} from "../constants/queAnsConstants";

export const askQuestionReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_QUESTION_REQUEST:
      return { loading: true };
    case POST_QUESTION_SUCCESS:
      return { loading: false, success: true, questions: action.payload };
    case POST_QUESTION_FAIL:
      return { loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

export const questionListReducer = (state = { questions: [] }, action) => {
  switch (action.type) {
    case GET_QUESTIONS_REQUEST:
      return { loading: true, questions: [] };
    case GET_QUESTIONS_SUCCESS:
      return { loading: false, questions: action.payload };
    case GET_QUESTIONS_FAIL:
      return { loading: false, questions: [], error: action.payload };
    default:
      return state;
  }
};

export const singleQuestionReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SINGLE_QUESTION_REQUEST:
      return { loading: true };
    case GET_SINGLE_QUESTION_SUCCESS:
      return { loading: false, question: action.payload };
    case GET_SINGLE_QUESTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
