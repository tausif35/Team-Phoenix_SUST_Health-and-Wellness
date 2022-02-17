import axios from "axios";
import { API_HOST } from "../../../../E-commerce/front-end/src/constants/apiLinks";
import {
  FIND_DOCTOR_FAIL,
  FIND_DOCTOR_REQUEST,
  FIND_DOCTOR_SUCCESS,
} from "../constants/appointmentConstants";

export const doctorList = (doctorName, specialty) => async (dispatch) => {
  try {
    dispatch({ type: FIND_DOCTOR_REQUEST });

    const res = [
      {
        _id: "1sd12",
        name: "One",
        email: "2@example",
        phone: "0121211211",
        specializations: ["A", "B", "C"],
        qualifications: ["A", "B", "C"],
      },
    ];

    dispatch({
      type: FIND_DOCTOR_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: FIND_DOCTOR_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
