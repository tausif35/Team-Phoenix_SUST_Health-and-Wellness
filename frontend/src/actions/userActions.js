import axios from "axios";
import {
  POST_USER_LOGIN,
  POST_USER_REGISTER,
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  POST_DOCTOR_REGISTER,
  POST_DOCTOR_LOGIN,
} from "../constants/apiLinks";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_FAIL,
  USER_PASSWORD_UPDATE_REQUEST,
  USER_PASSWORD_UPDATE_SUCCESS,
  USER_PASSWORD_UPDATE_FAIL,
} from "../constants/userConstants";

export const login = (role, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const reqLink = role === "doctor" ? POST_DOCTOR_LOGIN : POST_USER_LOGIN;

    const res = await axios.post(reqLink, { email, password }, config);

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: res.data,
    });

    saveToLocalStorage(res.data, role);
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({
    type: USER_LOGOUT,
  });
};

export const register = (role, registrationInfo) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const formData = new FormData();

    Object.keys(registrationInfo).forEach((item) => {
      formData.append([item], registrationInfo[item]);
    });

    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    const reqLink =
      role === "doctor" ? POST_DOCTOR_REGISTER : POST_USER_REGISTER;

    const res = await axios.post(reqLink, formData, config);

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: res.data,
    });

    saveToLocalStorage(res.data, role);
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const res = await axios.get(GET_USER_PROFILE, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_PROFILE_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const res = await axios.patch(UPDATE_USER_PROFILE, user, config);

    dispatch({
      type: USER_PROFILE_UPDATE_SUCCESS,
      payload: res.data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: res.data,
    });

    saveToLocalStorage(res.data);
  } catch (error) {
    dispatch({
      type: USER_PROFILE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserPassword =
  (oldPassword, newPassword) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_PASSWORD_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const res = await axios.put(
        UPDATE_USER_PROFILE,
        { oldPassword, newPassword },
        config
      );

      dispatch({
        type: USER_PASSWORD_UPDATE_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: USER_PASSWORD_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

function saveToLocalStorage(userInfo, role = "user") {
  localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, role: role }));
}
