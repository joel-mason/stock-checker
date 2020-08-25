import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  EMAIL_FROM_RESET_TOKEN,
  FP_EMAIL_SENT,
  USER_NOT_LOADING,
  RESET_SUCCESS_MESSAGE
} from "./types";
// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login")) // re-direct to login on successful register
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const resetSuccessMessage = () => dispatch => {
  dispatch({
    type: RESET_SUCCESS_MESSAGE,
    payload: null
  })
}

export const resetPasswordWithEmail = (userData, history) => dispatch => {
  axios
    .put("/api/users/resetPasswordWithEmail", userData)
    .then(res => {
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
      dispatch({
        type: FP_EMAIL_SENT,
        payload: res.data
      })
    }) 
    .catch(err => {
      dispatch(setUserNotLoading())
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
};

export const resetPage = (token) => dispatch => {
  axios
    .get("/api/users/reset?token="+token)
    .then(res => {
      console.log(res.data);
      dispatch({
        type: EMAIL_FROM_RESET_TOKEN,
        payload: res.data
      })
    }) 
    .catch(err => {
      dispatch(setUserNotLoading())
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
    dispatch(setUserLoading())
};

export const forgotPassword = (userData) => dispatch => {
  axios
    .post("/api/users/forgotPassword", userData)
    .then(res => {
      console.log(res)
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
      dispatch({
        type: FP_EMAIL_SENT,
        payload: res.data
      })
    }) // re-direct to login on successful register
    .catch(err => {
      console.log(err.response.data)
      dispatch(setUserNotLoading())
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
  dispatch(setUserLoading())
};
// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
// Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch(setUserNotLoading())
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
};

export const updateUser = (userId, userData) => dispatch => {
  const url = "/api/users/" + userId + "/update"
  axios
    .put(url, userData)
    .then(res => {
      // Save to localStorage
// Set token to localStorage
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
      dispatch(setUserUpdateSuccess(res.data))
    })
    .catch(err => {
      dispatch(setUserNotLoading())
      dispatch(setUserUpdateSuccess(err.response.data))
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
    dispatch(setUserLoading());
};
// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
export const setUserNotLoading = () => {
  return {
    type: USER_NOT_LOADING
  };
};

export const setUserUpdateSuccess = (data) => {
  return {
    type: FP_EMAIL_SENT,
    payload: data
  }
}
// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("items");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};