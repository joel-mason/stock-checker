import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import itemReducer from "./itemReducer";
import argosReducer from "./argosReducer";
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  items: itemReducer,
  searchResults: argosReducer
});