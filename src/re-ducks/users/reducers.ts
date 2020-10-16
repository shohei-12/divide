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
        tasks: [action.payload!.task, ...state.tasks],
      };
    case Actions.TASK_DIVISION:
      return {
        ...state,
      };
    case Actions.TASK_UPDATE:
      return {
        ...state,
      };
    case Actions.TASK_DELETE:
      return {
        ...state,
      };
    default:
      return state;
  }
};
