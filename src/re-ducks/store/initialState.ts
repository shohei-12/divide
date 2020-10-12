import { UserState } from "../users/types";

const initialUserState: UserState = {
  isSignedIn: false,
  uid: "",
  username: "",
  email: "",
  tasks: [],
};

export const initialState = {
  users: initialUserState,
};
