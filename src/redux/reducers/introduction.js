import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  introductionData: null,
  loading: true,
};

const fetchIntroductionStart = (state, action) => {
  return updateObject(state);
};

const fetchIntroductionFail = (state, action) => {
  return updateObject(state);
};

const fetchIntroductionSuccess = (state, action) => {
  return updateObject(state, {
    introductionData: action.introductionData,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_INTRODUCTION_START:
      return fetchIntroductionStart(state, action);
    case actionTypes.FETCH_INTRODUCTION_SUCCESS:
      return fetchIntroductionSuccess(state, action);
    case actionTypes.FETCH_INTRODUCTION_FAIL:
      return fetchIntroductionFail(state, action);
    default:
      return state;
  }
};

export default reducer;
