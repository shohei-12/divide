import * as Actions from "./actions";
import { initialState } from "../store/initialState";
import { UserAction } from "./types";

export const UsersReducer = (
  state = initialState.users,
  action: UserAction
) => {
  switch (action.type) {
    case Actions.SIGN_IN:
      return {
        ...state,
        ...action.payload,
      };
    case Actions.SIGN_OUT:
      return {
        ...action.payload,
      };
    case Actions.TASK_REGISTRATION:
      return {
        ...state,
        tasks: [action.payload.task, ...state.tasks],
      };
    default:
      return state;
  }
};
