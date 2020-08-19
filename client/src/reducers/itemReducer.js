import {
    GET_USER_ITEMS,
    ITEMS_LOADING,
    SET_USER_ITEMS,
    DELETE_USER_ITEM
  } from "../actions/types";
  const initialState = {
    items: {
      items: [],
      stores: []
    },
    loadingItems: false
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_USER_ITEMS:
        return {
          ...state,
          items: action.payload
        };
      case SET_USER_ITEMS:
        return {
            ...state,
            items: action.payload
        };
      case ITEMS_LOADING:
        return {
          ...state,
          loadingItems: true
        };
      case DELETE_USER_ITEM:
          return {
              ...state,
              items: action.payload
          }
      default:
        return state;
    }
  }