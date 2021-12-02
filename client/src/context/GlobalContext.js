import { LISTS } from "keys";
import React, { createContext, useReducer } from "react";
import { axiosInstance } from "utils/axios";

import { AppReducer } from "./AppReducer";
import { GET_LIST, LOGOUT, SET_LANGUAGE, SET_QUERY, SET_USER } from "./types";
// import ToastNotify from 'components/common/ToastNotify';

// init state
const initState = {
  isAuthenticated: false,
  user: {},
  language: "en",
  majors: [],
  volumes: [],
  totalDownload: 0,
};

// create context
export const GlobalContext = createContext(initState);

// provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initState);

  function setCurrentUser(user) {
    dispatch({
      type: SET_USER,
      payload: user,
    });
  }

  function logout() {
    localStorage.removeItem("token");
    dispatch({
      type: LOGOUT,
    });
  }

  function setLanguage(language) {
    localStorage.setItem("lang", language);
    dispatch({
      type: SET_LANGUAGE,
      payload: language,
    });
  }

  async function getLists() {
    try {
      const res = await axiosInstance.get("/list");
      dispatch({
        type: GET_LIST,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        language: state.language,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        majors: state.majors,
        volumes: state.volumes,
        loading: state.loading,
        totalDownload: state.totalDownload,
        setLanguage,
        setCurrentUser,
        logout,
        getLists,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
