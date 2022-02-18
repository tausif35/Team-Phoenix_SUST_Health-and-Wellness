import axios from "axios";
import { GET_DOCTOR_LIST } from "../constants/apiLinks";
import {
  FIND_DOCTOR_FAIL,
  FIND_DOCTOR_REQUEST,
  FIND_DOCTOR_SUCCESS,
} from "../constants/appointmentConstants";

export const doctorList =
  (doctorName, speciality) => async (dispatch, getState) => {
    try {
      dispatch({ type: FIND_DOCTOR_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const res = await axios.get(
        `${GET_DOCTOR_LIST}/?doctorName=${doctorName}&speciality=${speciality}`,
        config
      );

      dispatch({
        type: FIND_DOCTOR_SUCCESS,
        payload: res.data.doctors,
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
