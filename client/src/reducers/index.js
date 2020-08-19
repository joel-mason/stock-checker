import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import itemReducer from "./itemReducer";
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  items: itemReducer
});