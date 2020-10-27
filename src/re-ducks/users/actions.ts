import { DispatchAction } from "./types";

export const SIGN_IN = "SIGN_IN";
export const signInAction = (userState: DispatchAction) => {
  return {
    type: "SIGN_IN",
    payload: {
      isSignedIn: true,
      ...userState,
    },
  };
};

export const SIGN_OUT = "SIGN_OUT";
export const signOutAction = () => {
  return {
    type: "SIGN_OUT",
    payload: {
      isSignedIn: false,
      uid: "",
      email: "",
      tasks: [],
    },
  };
};

export const TASK_NON_PAYLOAD = "TASK_NON_PAYLOAD";
export const taskNonPayloadAction = () => {
  return {
    type: "TASK_NON_PAYLOAD",
  };
};

export const TOGGLE_THEME = "TOGGLE_THEME";
export const toggleThemeAction = (themeState: DispatchAction) => {
  return {
    type: "TOGGLE_THEME",
    payload: {
      ...themeState,
    },
  };
};
