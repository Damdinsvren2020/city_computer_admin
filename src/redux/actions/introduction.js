import * as actionTypes from "./actionTypes";
import axios from "../../axios";

export const fetchIntroductionFail = (error) => {
  return {
    type: actionTypes.FETCH_INTRODUCTION_FAIL,
    error: error,
  };
};

export const fetchIntroductionStart = () => {
  return {
    type: actionTypes.FETCH_INTRODUCTION_START,
  };
};

export const fetchIntroductionSuccess = (data) => {
  return {
    type: actionTypes.FETCH_INTRODUCTION_SUCCESS,
    introductionData: data,
  };
};

export const fetchIntroduction = () => {
  return (dispatch) => {
    dispatch(fetchIntroductionStart());
    axios
      .get("http://103.29.144.253:8083/api/v1/HomeTaniltsuulgaZurag")
      .then((response) => {
        dispatch(fetchIntroductionSuccess(response.data.data));
      })

      // this.setState({ response: response.data.data })
      .catch((error) => console.log(error));
  };
};
