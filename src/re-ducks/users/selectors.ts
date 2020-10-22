import { createSelector } from "reselect";
import { State } from "../store/types";

const usersSelector = (state: State) => state.users;

export const getIsSignedIn = createSelector(
  [usersSelector],
  (state) => state.isSignedIn
);

export const getUserId = createSelector([usersSelector], (state) => state.uid);

export const getEmail = createSelector([usersSelector], (state) => state.email);

export const getTheme = createSelector([usersSelector], (state) => state.theme);

export const getTasks = createSelector([usersSelector], (state) => state.tasks);
