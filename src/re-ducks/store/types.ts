import { UserState } from "../users/types";

export type State = {
  users: UserState;
  router: {
    location: {
      pathname: string;
      search: string;
      hash: string;
      key: string;
      query: any;
    };
    action: string;
  };
};
