//Host of the api
export const API_HOST = "http://localhost:5000";

//@desc Post for new user account register
//@format API_HOST/api/patients/signup
export const POST_USER_REGISTER = `${API_HOST}/api/patients/signup`;

//@desc Post for new doctor account register
//@format API_HOST/api/doctors/signup
export const POST_DOCTOR_REGISTER = `${API_HOST}/api/doctors/signup`;

//@desc Post login info to login as user
//@format API_HOST/api/patients/login
export const POST_USER_LOGIN = `${API_HOST}/api/patients/login`;

//@desc Post login info to login as doctor
//@format API_HOST/api/doctors/login
export const POST_DOCTOR_LOGIN = `${API_HOST}/api/doctors/login`;

//@desc Get user profile info
//@format API_HOST/api/users/profile
export const GET_USER_PROFILE = `${API_HOST}/api/users/profile`;

//@desc Update user profile (patch) info or password (put)
//@format API_HOST/api/users/profile
export const UPDATE_USER_PROFILE = `${API_HOST}/api/users/profile`;

export const GET_DOCTOR_LIST = `${API_HOST}/api/patients/findDoctors`;
