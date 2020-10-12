import { DispatchSignInAction } from "./types";

export const SIGN_IN = "SIGN_IN";
export const signInAction = (userState: DispatchSignInAction) => {
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
      username: "",
      email: "",
      tasks: [],
    },
  };
};
