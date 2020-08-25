import {
    SET_CURRENT_USER,
    USER_LOADING,
    FP_EMAIL_SENT,
    EMAIL_FROM_RESET_TOKEN,
    USER_NOT_LOADING,
    RESET_SUCCESS_MESSAGE
  } from "../actions/types";
  const isEmpty = require("is-empty");
  const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
    email: {
      email: '',
      message: ''
    },
    successMessage: '',
    emailSent: false,
    
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload,
          successMessage: '',
        };
      case USER_LOADING:
        return {
          ...state,
          loading: true
        };
      case USER_NOT_LOADING:
        return {
          ...state,
          loading: false
      };
      case FP_EMAIL_SENT:
        return {
          ...state,
          emailSent: true,
          successMessage: action.payload.message,
          loading: false
      };
      case RESET_SUCCESS_MESSAGE: 
        return {
          ...state, 
          successMessage: ''
        }
      case EMAIL_FROM_RESET_TOKEN:
        return {
          ...state,
          email: {
            email: action.payload.email,
            message: action.payload.message
          },
          loading: false,
          successMessage: '',
        }
      default:
        return state;
    }
  }