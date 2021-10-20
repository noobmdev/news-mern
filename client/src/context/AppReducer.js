import { GET_LIST, LOGOUT, SET_LANGUAGE, SET_USER } from "./types";

export const AppReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_LANGUAGE:
      return {
        ...state,
        language: payload,
      };

    case SET_USER:
      return {
        ...state,
        isAuthenticated: !!Object.keys(payload).length,
        user: payload,
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };

    case GET_LIST:
      return {
        ...state,
        majors: payload?.majors ?? [],
        volumes: payload?.volumes ?? [],
      };

    default:
      return state;
  }
};
