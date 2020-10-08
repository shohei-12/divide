import { createSelector } from "reselect";
import { State } from "../store/types";

const usersSelector = (state: State) => state.users;

export const getUsername = createSelector(
  [usersSelector],
  (state) => state.username
);

export const getEmail = createSelector([usersSelector], (state) => state.email);
