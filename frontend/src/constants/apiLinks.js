//Host of the api
export const API_HOST = "http://localhost:5000";

export const POST_USER_REGISTER = `${API_HOST}/api/patients/signup`;

export const POST_DOCTOR_REGISTER = `${API_HOST}/api/doctors/signup`;

export const POST_USER_LOGIN = `${API_HOST}/api/patients/login`;

export const POST_DOCTOR_LOGIN = `${API_HOST}/api/doctors/login`;

export const GET_USER_PROFILE = `${API_HOST}/api/users/profile`;

export const UPDATE_USER_PROFILE = `${API_HOST}/api/users/profile`;

export const GET_DOCTOR_LIST = `${API_HOST}/api/doctors/find`;

export const POST_QUESTION = `${API_HOST}/api/QnA/question`;

export const GET_QUESTION_LIST = `${API_HOST}/api/QnA`;

export const GET_SINGLE_QUESTION = `${API_HOST}/api/QnA/question`;

export const GET_PERSONAL_QUESTIONS = `${API_HOST}/api/QnA/user`;

export const POST_ANSWER = `${API_HOST}/api/QnA/answer`;

export const GET_SINGLE_ANSWER = `${API_HOST}/api/QnA/answer`;

export const UPVOTE_ANSWER = `${API_HOST}/api/QnA/upvote`;

export const GET_BLOG_LIST = `${API_HOST}/api/blogs`;

export const GET_SINGLE_BLOG = `${API_HOST}/api/blogs`;

export const POST_BLOG = `${API_HOST}/api/blogs/write`;

export const POST_BLOG_COMMENT = `${API_HOST}/api/blogs/comment`;

export const GET_PERSONAL_BLOGS = `${API_HOST}/api/blogs/doctor`;
