import {
  FIND_DOCTOR_FAIL,
  FIND_DOCTOR_REQUEST,
  FIND_DOCTOR_SUCCESS,
} from "../constants/appointmentConstants";

export const doctorListReducer = (state = { doctors: [] }, action) => {
  switch (action.type) {
    case FIND_DOCTOR_REQUEST:
      return { loading: true, doctors: [] };
    case FIND_DOCTOR_SUCCESS:
      return { loading: false, doctors: action.payload };
    case FIND_DOCTOR_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
