export interface State {
  users: {
    isSignedIn: boolean;
    uid: string;
    username: string;
    email: string;
  };
  router: any;
}
