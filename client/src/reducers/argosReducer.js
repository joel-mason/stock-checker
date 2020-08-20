import {
    ARGOS_SEARCH_ITEM,
    ARGOS_SEARCH_LOADING
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
          searchResults: action.payload
        };
      case ARGOS_SEARCH_LOADING:
        return {
          ...state,
          loadingItems: true
        };
      default:
        return state;
    }
  }