import axios from "axios";
import {
  ARGOS_SEARCH_ITEM,
  GET_ERRORS,
  ARGOS_SEARCH_LOADING
} from "./types";
export const getArgosSearch = (searchQuery, pageNo) => dispatch => {
  const url = "api/argos/search?searchQuery="+searchQuery + "&pageNo=" + pageNo;
  axios.get(url).then(res => {
    const { results } = res.data;
    localStorage.setItem("searchResults", results);
    console.log(results)
    // Set current user
    dispatch(setItems(results))
  })
  .catch(err => {
    console.log("error", err);
    dispatch({
      type: GET_ERRORS,
      payload: err
    })
  })
  console.log("I am loading")
  dispatch(setItemsLoading())
};

// Set logged in user
export const setItems = searchResults => {
  return {
    type: ARGOS_SEARCH_ITEM,
    payload: searchResults
  };
};
// User loading
export const setItemsLoading = () => {
  return {
    type: ARGOS_SEARCH_LOADING
  };
};

export const removeItems = () => dispatch => {
  localStorage.removeItem("searchResults");
  dispatch(setItems({}));
};
