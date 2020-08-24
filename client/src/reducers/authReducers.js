import {
    SET_CURRENT_USER,
    USER_LOADING,
    FP_EMAIL_SENT,
    EMAIL_FROM_RESET_TOKEN
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
    emailSent: false,
    
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload
        };
      case USER_LOADING:
        return {
          ...state,
          loading: true
        };
      case FP_EMAIL_SENT:
        return {
          ...state,
          emailSent: true
      };
      case EMAIL_FROM_RESET_TOKEN:
        return {
          ...state,
          email: {
            email: action.payload.email,
            message: action.payload.message
          }
        }
      default:
        return state;
    }
  }