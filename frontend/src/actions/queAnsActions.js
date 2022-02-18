import axios from "axios";
import { GET_DOCTOR_LIST, POST_QUESTION } from "../constants/apiLinks";
import {
  FIND_DOCTOR_FAIL,
  FIND_DOCTOR_REQUEST,
  FIND_DOCTOR_SUCCESS,
} from "../constants/appointmentConstants";
import {
  POST_QUESTION_FAIL,
  POST_QUESTION_REQUEST,
  POST_QUESTION_SUCCESS,
} from "../constants/queAnsConstants";

export const postQuestion = (question) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_QUESTION_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const queBody = {
      questionTitle: question.questionTitle,
      questionBody: question.questionBody,
      questionCategory: question.questionCategory,
      askedBy: question.anonymous ? "" : userInfo.name,
    };

    console.log(queBody);

    const res = await axios.post(`${POST_QUESTION}`, queBody, config);

    dispatch({
      type: POST_QUESTION_SUCCESS,
      payload: res.data.doctors,
    });
  } catch (error) {
    dispatch({
      type: POST_QUESTION_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
