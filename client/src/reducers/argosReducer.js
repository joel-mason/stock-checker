import {
    ARGOS_SEARCH_ITEM,
    ARGOS_SEARCH_LOADING,
    ARGOS_SEARCH_ERROR
  } from "../actions/types";
  const initialState = {
    searchResults: {},
    loadingItems: false
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case ARGOS_SEARCH_ITEM:
        return {
          ...state,
          searchResults: action.payload,
          loadingItems: false
        };
      case ARGOS_SEARCH_LOADING:
        return {
          ...state,
          loadingItems: true
        };
      case ARGOS_SEARCH_ERROR:
        return {
          ...state,
          error: action.payload
        }
      default:
        return state;
    }
  }