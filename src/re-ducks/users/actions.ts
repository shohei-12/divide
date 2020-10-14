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
      username: "",
      email: "",
      tasks: [],
    },
  };
};

export const TASK_REGISTRATION = "TASK_REGISTRATION";
export const taskRegistrationAction = (taskState: DispatchAction) => {
  return {
    type: "TASK_REGISTRATION",
    payload: {
      task: taskState.task,
    },
  };
};

export const TASK_DIVISION = "TASK_DIVISION";
export const taskDivisionAction = () => {
  return {
    type: "TASK_DIVISION",
  };
};
