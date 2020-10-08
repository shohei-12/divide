export interface UserState {
  uid: string;
  username: string;
}

export interface UserAction {
  type: string;
  payload: {
    isSignedIn: boolean;
    uid: string;
    username: string;
  };
}
