import { UserState } from "../users/types";

const initialUserState: UserState = {
  isSignedIn: false,
  uid: "",
  email: "",
  tasks: [],
  theme: "light",
};

export const initialState = {
  users: initialUserState,
};
