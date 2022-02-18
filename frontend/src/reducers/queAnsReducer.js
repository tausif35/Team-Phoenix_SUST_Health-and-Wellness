import {
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
