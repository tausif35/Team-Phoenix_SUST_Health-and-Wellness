import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { doctorListReducer } from "./reducers/appointmentReducer";
import {
  askQuestionReducer,
  personalQuestionsReducer,
  questionListReducer,
  singleQuestionReducer,
  writeAnswerReducer,
} from "./reducers/queAnsReducer";
import { socketConnectionReducer } from "./reducers/socketReducer";
import {
  userDetailsReducer,
  userLoginReducer,
  userPasswordUpdateReducer,
  userProfileUpdateReducer,
  userRegisterReducer,
} from "./reducers/userReducer";

const reducer = combineReducers({
  userRegister: userRegisterReducer,
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer,
  userProfileUpdate: userProfileUpdateReducer,
  userPasswordUpdate: userPasswordUpdateReducer,
  doctorList: doctorListReducer,
  askQuestion: askQuestionReducer,
  questionList: questionListReducer,
  singleQuestion: singleQuestionReducer,
  personalQuestions: personalQuestionsReducer,
  writeAnswer: writeAnswerReducer,
  socketConnection: socketConnectionReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : {};

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
